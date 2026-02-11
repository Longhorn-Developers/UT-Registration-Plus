import getScriptType, { ScriptType } from '../getScriptType';
import type { IMessageListener, Message, MessageHandler, Serializable } from '../types';
import { MessageEndpoint } from '../types';

/**
 * Options for configuring a message listener.
 */
export interface MessageListenerOptions {
    /**
     * A callback function that will be called when an error occurs.
     * Useful if you want to log errors to a service like Sentry or Bugsnag.
     * @param error The error that occurred.
     */
    onError?: (error: Error) => void;

    /**
     * A flag indicating whether verbose logging should be enabled.
     */
    verbose?: boolean;
}

/**
 * An object that can be used to listen for and handle messages coming from another extension context.
 */
export class MessageListener<M> implements IMessageListener<M> {
    private handlers: MessageHandler<M>;
    private scriptType: ScriptType;
    private myEndpoint: MessageEndpoint;
    private listeningFor: MessageEndpoint;

    private onError?: (error: Error) => void;

    private isVerbose: boolean = false;

    /**
     * An object that can be used to listen for and handle messages coming from another extension context.
     * @param handlers the message handlers for the messages that this listener will handle. When a message is received, the corresponding message handler is called.
     */
    constructor(handlers: MessageHandler<M>) {
        this.handlers = handlers;

        // we want to know what type of script we are running in so we can determine what endpoint we are (background or foreground)
        const scriptType = getScriptType();
        if (!scriptType) {
            throw new Error('[crx-kit]: Unable to determine extension script type.');
        }
        this.scriptType = scriptType;

        if (this.scriptType === ScriptType.BACKGROUND_SCRIPT) {
            this.myEndpoint = MessageEndpoint.BACKGROUND;
            this.listeningFor = MessageEndpoint.FOREGROUND;
        } else {
            this.myEndpoint = MessageEndpoint.FOREGROUND;
            this.listeningFor = MessageEndpoint.BACKGROUND;
        }
    }

    private handleMessage = (
        message: Message<M>,
        sender: chrome.runtime.MessageSender,
        sendResponse: (response: any) => void
    ): boolean => {
        if (message.to !== this.myEndpoint && message.from !== this.listeningFor) {
            // this message is not for my current context, so ignore it
            return true;
        }
        const messageName = message.name as string;

        // @ts-expect-error
        const handler = this.handlers[messageName];
        if (!handler) {
            // this message is for my current context, but I don't have a handler for it, so ignore it
            return true;
        }
        try {
            if (this.isVerbose) {
                console.log(`[crx-kit]: message received: ${messageName}`, {
                    name: messageName,
                    data: message.data,
                    sender,
                });
            }
            // this message is for my current context, and I have a handler for it, so handle it
            handler({
                data: message.data as Serializable<typeof message.data>,
                sendResponse,
                sender,
            });
        } catch (error) {
            console.error(`[crx-kit]: Error handling message ${messageName}`, {
                name: messageName,
                error,
                message,
                sender,
            });
            if (this.onError) {
                // @ts-expect-error
                this.onError(error);
            }
        }

        return true;
    };

    /**
     * Listens for messages from the specified source.
     * @param options - The options for the message listener.
     */
    public listen(options: MessageListenerOptions = { verbose: false }) {
        this.isVerbose = options.verbose ?? false;
        this.onError = options.onError;
        console.log(`[crx-kit]: ${this.toString()} listening for messages from ${this.listeningFor}`);
        chrome.runtime.onMessage.addListener(this.handleMessage);
    }

    /**
     * Stops listening for messages
     */
    public unlisten() {
        console.log(`[crx-kit]: ${this.toString()} no longer listening for messages from ${this.listeningFor}`);
        chrome.runtime.onMessage.removeListener(this.handleMessage);
    }

    private toString() {
        return `MessageListener(${this.myEndpoint})`;
    }
}

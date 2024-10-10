/* eslint-disable react/no-unstable-nested-components */
import React, { useEffect, useState } from 'react';
import type { Options as RMOptions } from 'react-markdown';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';

const changelog = new URL('/CHANGELOG.md', import.meta.url).href;

/**
 * Renders a popup component for displaying the changelog.
 *
 * @param isOpen - A boolean indicating whether the popup is open or not.
 * @param onClose - A function to be called when the popup is closed.
 *
 * @returns The JSX element representing the ChangelogPopup component.
 */
export default function ChangelogPopup(): JSX.Element {
    const [markdownContent, setMarkdownContent] = useState('');

    useEffect(() => {
        fetch(changelog)
            .then(response => response.text())
            .then(text => setMarkdownContent(text))
            .catch(error => console.error('Error fetching changelog:', error));
    }, []);

    const MarkdownComponents: RMOptions['components'] = {
        h1: ({ children, ...props }) => (
            <h1 className='mb-4 mt-6 text-3xl font-bold' {...props}>
                {children}
            </h1>
        ),
        h2: ({ children, ...props }) => (
            <h2 className='mb-3 mt-5 text-2xl font-semibold' {...props}>
                {children}
            </h2>
        ),
        h3: ({ children, ...props }) => (
            <h3 className='mb-2 mt-4 text-xl font-medium' {...props}>
                {children}
            </h3>
        ),
        h4: ({ children, ...props }) => (
            <h4 className='mb-2 mt-3 text-lg font-medium' {...props}>
                {children}
            </h4>
        ),
        h5: ({ children, ...props }) => (
            <h5 className='mb-1 mt-2 text-base font-medium' {...props}>
                {children}
            </h5>
        ),
        h6: ({ children, ...props }) => (
            <h6 className='mb-1 mt-2 text-sm font-medium' {...props}>
                {children}
            </h6>
        ),
        p: ({ children, ...props }) => (
            <p className='mb-4' {...props}>
                {children}
            </p>
        ),
        a: ({ children, ...props }) => (
            <a className='text-blue-500 hover:underline' {...props}>
                {children}
            </a>
        ),
        ul: ({ children, ...props }) => (
            <ul className='mb-4 list-disc pl-6' {...props}>
                {children}
            </ul>
        ),
        ol: ({ children, ...props }) => (
            <ol className='mb-4 list-decimal pl-6' {...props}>
                {children}
            </ol>
        ),
        li: ({ children, ...props }) => (
            <li className='mb-1' {...props}>
                {children}
            </li>
        ),
        blockquote: ({ children, ...props }) => (
            <blockquote className='mb-4 border-l-4 border-gray-300 py-2 pl-4 italic' {...props}>
                {children}
            </blockquote>
        ),
        hr: props => <hr className='my-4 border-t border-gray-300' {...props} />,
        table: ({ children, ...props }) => (
            <div className='mb-4 overflow-x-auto'>
                <table className='min-w-full divide-y divide-gray-300' {...props}>
                    {children}
                </table>
            </div>
        ),
        thead: ({ children, ...props }) => (
            <thead className='bg-gray-50' {...props}>
                {children}
            </thead>
        ),
        tbody: ({ children, ...props }) => (
            <tbody className='divide-y divide-gray-200' {...props}>
                {children}
            </tbody>
        ),
        tr: ({ children, ...props }) => (
            <tr className='hover:bg-gray-50' {...props}>
                {children}
            </tr>
        ),
        th: ({ children, ...props }) => (
            <th className='px-6 py-3 text-left text-xs text-gray-500 font-medium tracking-wider uppercase' {...props}>
                {children}
            </th>
        ),
        td: ({ children, ...props }) => (
            <td className='whitespace-nowrap px-6 py-4' {...props}>
                {children}
            </td>
        ),
        pre: ({ children, ...props }) => (
            <pre className='mb-4' {...props}>
                {children}
            </pre>
        ),
        code: ({ className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            return match ? (
                <SyntaxHighlighter PreTag='div' style={vscDarkPlus} language={match[1]}>
                    {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
            ) : (
                <code className='rounded bg-gray-100 px-1 py-0.5 dark:bg-gray-800' {...props}>
                    {children}
                </code>
            );
        },
        em: ({ children, ...props }) => (
            <em className='italic' {...props}>
                {children}
            </em>
        ),
        strong: ({ children, ...props }) => (
            <strong className='font-bold' {...props}>
                {children}
            </strong>
        ),
        del: ({ children, ...props }) => (
            <del className='line-through' {...props}>
                {children}
            </del>
        ),
        img: ({ src, alt, ...props }) => (
            <img src={src} alt={alt} className='my-4 h-auto max-w-full rounded-md' {...props} />
        ),
    };

    return (
        <div className='px-4'>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={MarkdownComponents}
                className='text-gray-800 dark:text-gray-200'
            >
                {markdownContent}
            </ReactMarkdown>
        </div>
    );
}

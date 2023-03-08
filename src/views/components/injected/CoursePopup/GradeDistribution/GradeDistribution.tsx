/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import Card from 'src/views/components/common/Card/Card';
import { bMessenger } from 'src/shared/messages';
import { Course } from 'src/shared/types/Course';
import styles from './GradeDistribution.module.scss';
import colors from 'src/views/styles/colors.module.scss';

enum DataStatus {
    LOADING = 'LOADING',
    DONE = 'DONE',
    ERROR = 'ERROR',
}

interface Props {
    course: Course;
}

export default function GradeDistribution({ course }: Props) {
    const [chartOptions, setChartOptions] = useState<Highcharts.Options>({
        title: {
            text: undefined,
        },
        subtitle: {
            text: undefined,
        },
        legend: {
            enabled: false,
        },
        xAxis: {
            title: {
                text: 'Grades',
            },
            categories: ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F'],
            crosshair: true,
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Students',
            },
        },
        chart: {
            style: {
                fontFamily: 'Inter',
                fontWeight: '600',
            },
        },
        credits: {
            enabled: false,
        },
        tooltip: {
            headerFormat: '<span style="font-size:small; font-weight:bold">{point.key}</span><table>',
            pointFormat:
                '<td style="color:{black};padding:0;font-size:small; font-weight:bold;"><b>{point.y:.0f} Students</b></td>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true,
        },
        plotOptions: {
            bar: {
                pointPadding: 0.2,
                borderWidth: 0,
            },
            series: {
                animation: {
                    duration: 700,
                },
            },
        },
        series: [
            {
                type: 'column',
                name: 'Grades',
                data: Array.from({ length: 12 }, () => 0),
            },
        ],
    });
    const [status, setStatus] = useState<DataStatus>(DataStatus.LOADING);

    useEffect(() => {
        bMessenger.getDistribution({ course }).then(distribution => {
            if (!distribution) {
                return setStatus(DataStatus.ERROR);
            }

            setChartOptions(options => ({
                ...options,
                series: [
                    {
                        type: 'column',
                        name: 'Grades',
                        data: distribution.map((y, i) => ({
                            y,
                            // eslint-disable-next-line no-nested-ternary
                            // color: i < 8 ? '#2ECC71' : i < 10 ? '#F1C40F' : '#E74C3C',
                            // eslint-disable-next-line no-nested-ternary
                            color:
                                i < 3
                                    ? colors.turtle_pond
                                    : i < 5
                                    ? colors.cactus
                                    : i < 7
                                    ? colors.sunshine
                                    : i < 10
                                    ? colors.tangerine
                                    : colors.speedway_brick,
                        })),
                    },
                ],
            }));
        });
    }, [course]);

    if (!chartOptions.series?.length) {
        return null;
    }

    return (
        <Card className={styles.container}>
            <HighchartsReact highcharts={Highcharts} options={chartOptions} />
        </Card>
    );
}

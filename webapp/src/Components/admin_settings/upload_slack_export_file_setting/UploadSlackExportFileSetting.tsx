import React, { Fragment, useEffect, useState } from 'react'

import './uploadSlackExportFileSetting.css'

function UploadSlackExportFileSetting() {
    type Channel = {
        access: string;
        date_created: number;
        id: string;
        name: string;
        no_members: number;
        purpose: string;
        checked?: boolean;
        startDate?: string;
        endDate?: string;
    };

    // eslint-disable-next-line no-process-env
    const apiURL = process.env.MM_PLUGIN_API_URL;
    const [loading, setLoading] = useState(false);
    const [slackExportFile, setSlackExportFile] = useState();
    const [allChecked, setAllChecked] = useState(false);
    const [unfilteredChannels, setUnfilteredChannels] = useState<Channel[]>([]);
    const [isUploaded, setIsUploaded] = useState(false);

    const noneChecked = unfilteredChannels.every((channel) => !channel.checked);

    const restoreState = () => {
        // eslint-disable-next-line no-undefined
        setSlackExportFile(undefined);
        setUnfilteredChannels([]);

        // setAllChecked(false);
    };

    const handleUpload = async (e) => {
        e.preventDefault();

        if (e.target.files.length === 0) {
            return;
        }

        const label	 = e.target.nextElementSibling;
        const labelVal = label.innerHTML;

        const fileName = e.target.value.split('\\').pop();

        if (fileName) {
            label.querySelector('span').innerHTML = fileName;
        } else {
            label.innerHTML = labelVal;
        }

        const file = e.target.files[0];

        const formData = new FormData();

        formData.append('file', file);

        const res = await fetch(`${apiURL}/upload_slack_zip`, {
            method: 'POST',

            // DO NOT set the Content-Type header. The browser will set it for you, including the boundary parameter.

            // headers: {
            //     'Content-Type': 'multipart/form-data',
            // },
            body: formData,
        });

        if (res.status !== 200) {
            // eslint-disable-next-line no-console
            console.error('failed to upload file');
        }

        const resJson = await res.json();

        // eslint-disable-next-line no-console
        // console.log('resJson', resJson);

        const unfilteredChnls = resJson.map((channel) => {
            if (!Object.prototype.hasOwnProperty.call(channel, 'checked')) {
                channel.checked = false;
            }

            if (!Object.prototype.hasOwnProperty.call(channel, 'startDate')) {
                channel.startDate = '';
            }

            if (!Object.prototype.hasOwnProperty.call(channel, 'endDate')) {
                channel.endDate = '';
            }

            return channel;
        });

        setUnfilteredChannels(unfilteredChnls);
    };

    // handle all checked when unfilteredChannels changes
    useEffect(() => {
        if (unfilteredChannels.length === 0) {
            return;
        }

        const allChannelsChecked = unfilteredChannels.every((channel) => channel.checked);

        setAllChecked(allChannelsChecked);
    }, [unfilteredChannels]);

    const handleAllChannelCheck = (e) => {
        const checked = e.target.checked;

        setUnfilteredChannels((currentUnfilteredChannels) => {
            const newUnfilteredChannels = currentUnfilteredChannels.map((channel) => {
                channel.checked = checked;
                return channel;
            });

            return newUnfilteredChannels;
        });

        setAllChecked(checked);
    };

    const handleChannelCheck = (e, id) => {
        const checked = e.target.checked;

        setUnfilteredChannels((currentUnfilteredChannels) => {
            const newUnfilteredChannels = currentUnfilteredChannels.map((channel) => {
                if (channel.id === id) {
                    channel.checked = checked;
                }
                return channel;
            });

            return newUnfilteredChannels;
        });
    };

    const prependZeroForSingleDigitNumbers = (num: number): string => {
        return num.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false});
    };

    const formatDate = (id: string, dateTime: number): string => {
        const date = new Date(dateTime);

        const year = prependZeroForSingleDigitNumbers(date.getFullYear());
        const month = prependZeroForSingleDigitNumbers(date.getMonth() + 1);
        const day = prependZeroForSingleDigitNumbers(date.getDate());

        const formattedDate = `${year}-${month}-${day}`;

        return formattedDate;
    };

    const calcEndDateMin = (id: string): string => {
        const {startDate, date_created} = unfilteredChannels.filter((channel) => channel.id === id)[0];

        if (!startDate) {
            return formatDate(id, date_created * 1000);
        }

        const startDateArr = startDate.split('-');

        const year = prependZeroForSingleDigitNumbers(
            parseInt(startDateArr[0], 10),
        );
        const month = prependZeroForSingleDigitNumbers(
            parseInt(startDateArr[1], 10),
        );
        const day = prependZeroForSingleDigitNumbers(
            parseInt(startDateArr[2], 10) + 1,
        );

        const endDateMin = `${year}-${month}-${day}`;

        return endDateMin;
    };

    const handleStartDateChange = (e, id) => {
        e.preventDefault();

        setUnfilteredChannels((currentUnfilteredChannels) => {
            const newUnfilteredChannels = currentUnfilteredChannels.map((channel) => {
                if (channel.id === id) {
                    channel.startDate = e.target.value;
                }
                return channel;
            });

            return newUnfilteredChannels;
        });
    };

    const handleEndDateChange = (e, id) => {
        e.preventDefault();

        setUnfilteredChannels((currentUnfilteredChannels) => {
            const newUnfilteredChannels = currentUnfilteredChannels.map((channel) => {
                if (channel.id === id) {
                    channel.endDate = e.target.value;
                }
                return channel;
            });

            return newUnfilteredChannels;
        });
    };

    const saveSlackData = async () => {
        setIsUploaded(false);

        const checkedChannels = unfilteredChannels.filter((channel) => channel.checked);

        const unCheckedChannels = unfilteredChannels.filter((channel) => !channel.checked);

        const checkedChannelsWithDateRange = checkedChannels.filter((channel) => channel.startDate && channel.endDate);

        const checkedChannelsWithStartDate = checkedChannels.filter((channel) => channel.startDate && !channel.endDate);

        const checkedChannelsWithEndDate = checkedChannels.filter((channel) => !channel.startDate && channel.endDate);

        const checkedChannelsWithNoDateRange = checkedChannels.filter((channel) => !channel.startDate && !channel.endDate);

        const postObj = {};

        for (const channel of checkedChannelsWithDateRange) {
            postObj[channel.id] = {
                store_all: false,
                store_none: false,
                start_date: new Date(channel.startDate).getTime() / 1000,
                end_date: new Date(channel.endDate).getTime() / 1000,
            };
        }

        for (const channel of checkedChannelsWithStartDate) {
            postObj[channel.id] = {
                store_all: false,
                store_none: false,
                start_date: new Date(channel.startDate).getTime() / 1000,
                end_date: Date.now() / 1000,
            };
        }

        for (const channel of checkedChannelsWithEndDate) {
            postObj[channel.id] = {
                store_all: false,
                store_none: false,
                start_date: channel.date_created,
                end_date: new Date(channel.endDate).getTime() / 1000,
            };
        }

        for (const channel of checkedChannelsWithNoDateRange) {
            postObj[channel.id] = {
                store_all: true,
                store_none: false,
                start_date: channel.date_created,
                end_date: Date.now() / 1000,
            };
        }

        for (const channel of unCheckedChannels) {
            postObj[channel.id] = {
                store_all: false,
                store_none: true,
                start_date: '',
                end_date: '',
            };
        }

        // eslint-disable-next-line no-console
        // console.log('postObj', postObj);

        const postOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postObj),
        };

        setLoading(true);

        try {
            const api = `${apiURL}/store_slack_data`;

            const res = await fetch(api!, postOptions);

            // const jsonRes = await res.json();

            // eslint-disable-next-line no-console
            console.log('jsonRes', res.statusText);

            restoreState();
            setIsUploaded(true);
        } catch (err: any) {
            // eslint-disable-next-line no-console
            console.warn('Error', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='upload-slack-export-container'>
            <div className='upload-slack-export-action'>
                <div className='upload-slack-export-action_file'>
                    <input
                        type='file'
                        name='file'
                        id='file'
                        accept='.zip' // make sure to add other file types if any
                        className='upload-slack-export-file-setting__upload'
                        value={slackExportFile}
                        onChange={handleUpload}
                    />
                    <label
                        htmlFor='file'
                        className='upload-slack-export-file-setting__label'
                    >
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            viewBox='0 0 24 24'
                        >
                            <path d='M14,2L20,8V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V4A2,2 0 0,1 6,2H14M18,20V9H13V4H6V20H18M12,12L16,16H13.5V19H10.5V16H8L12,12Z'/>
                        </svg>
                        <span> {'Choose a file...'} </span>
                    </label>
                </div>
                <div>
                    {unfilteredChannels.length > 0 && (
                        <button
                            className='upload-slack-export-action__button'
                            onClick={saveSlackData}
                            disabled={noneChecked}
                        >
                            {loading ? 'Saving...' : 'Save'}
                        </button>
                    )}
                </div>
            </div>
            {unfilteredChannels.length > 0 ? (
                <div className='upload-slack-export-channel-table-container'>
                    <table className='upload-slack-export-channel-table'>
                        <thead className='upload-slack-export-channel-table_head'>
                            <tr>
                                <th>
                                    <input
                                        type='checkbox'
                                        checked={allChecked}
                                        onChange={handleAllChannelCheck}
                                    />
                                </th>
                                <th>
                                    <span>{'Channel Name'}</span>
                                </th>
                                <th>
                                    <span>{'# Members'}</span>
                                </th>
                                <th>
                                    <span>{'Type'}</span>
                                </th>
                                <th>
                                    <span>{'Date Range'}</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className='upload-slack-export-channel-table_body'>
                            {unfilteredChannels.map((channel) => (
                                <tr key={channel.id}>
                                    <td>
                                        <input
                                            type='checkbox'
                                            checked={channel.checked}
                                            onChange={(e) => handleChannelCheck(e, channel.id)}
                                        />
                                    </td>
                                    <td>{channel.name}</td>
                                    <td>{channel.no_members}</td>
                                    <td>{channel.access}</td>
                                    <td className='upload-slack-export-date'>
                                        <input
                                            type='date'
                                            className='upload-slack-export-date-input'

                                            min={formatDate(channel.id, channel.date_created * 1000)}

                                            // min='2023-10-01'
                                            max={formatDate(channel.id, Date.now())}
                                            onChange={(e) => handleStartDateChange(e, channel.id)}
                                        />
                                        <span>{'to'}</span>
                                        <input
                                            type='date'
                                            className='upload-slack-export-date-input'
                                            min={calcEndDateMin(channel.id)}
                                            max={formatDate(channel.id, Date.now())}
                                            onChange={(e) => handleEndDateChange(e, channel.id)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <Fragment>
                    {isUploaded ? (
                        <p>{ 'Upload Successful' }</p>
                    ) : (
                        <p>{ 'Select slack export file ...' }</p>
                    )}
                </Fragment>
            )}
        </div>

    );
}

export default UploadSlackExportFileSetting;
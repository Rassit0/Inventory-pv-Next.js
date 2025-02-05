"use client"
import React, { ReactNode } from 'react'
import { Card, CardBody, Tab, Tabs } from '@nextui-org/react';

interface Iitem {
    id: string;
    label: string;
    content: string | ReactNode
    selected?: Boolean;
}

interface Props {
    tabs: Iitem[]
}

export const ReportSelectorTabs = ({ tabs }: Props) => {

    const defaultTab = tabs.find((tab) => tab.selected)?.id;

    return (
        <div className="container flex w-full flex-col">
            <Tabs aria-label="report selector" items={tabs} color='primary' variant='light' defaultSelectedKey={defaultTab}>
                {
                    (item) => (
                        <Tab key={item.id} title={item.label}>
                            <Card>
                                <CardBody>{item.content}</CardBody>
                            </Card>
                        </Tab>
                    )
                }
            </Tabs>
        </div>
    )
}

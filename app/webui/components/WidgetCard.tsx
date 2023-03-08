"use client";
import React, {useState} from 'react';
import styles from './WidgetCard.module.css';
import {Card, CardActionArea, CardContent, CardHeader, CardMedia, IconButton, Paper, Typography} from "@mui/material";
import {Add, AttachMoney, Close} from "@mui/icons-material";
import {CalculatorDialog} from "@/app/webui/components/CalculatorDialog";
import {PersonalLoans} from "@/app/webui/components/calculators/PersonalLoans";

export interface WidgetCardProps {
    title: string;
    description: string;
}

export const WidgetCard = (props: WidgetCardProps): JSX.Element => {
    const [open, setOpen] = useState(false)
    const {title, description} = props;
    return (
        <>
            <CalculatorDialog title={'Personal loan calculator'} handleClose={() => setOpen(false)} open={open} calculator={<PersonalLoans/>}/>
            <Card className={styles['widget-card']}>
                <CardActionArea onClick={() => setOpen(true)} >
                <CardHeader title={title}/>
                    <CardMedia style={{color: 'blue', height: '140px'}}>
                        <AttachMoney width={100} height={100}/>
                    </CardMedia>
                <CardContent style={{height: '100%'}}>
                    <Typography variant={'body2'} color="text.secondary">
                        {description}
                    </Typography>
                </CardContent>
                </CardActionArea>
            </Card>
        </>






        //
        // <Paper variant={'outlined'} className={styles['widget-card__paper']}>
        //     <div className={styles['widget-card__container']}>
        //     <div className={styles['title__card']}>
        //
        //     </div>
        //     <div className={styles['description__card']}>
        //         <Typography variant={'h6'}>{title}</Typography>
        //         <Typography variant={'body1'}>{description}</Typography>
        //     </div>
        //     </div>
        // </Paper>
    );
};

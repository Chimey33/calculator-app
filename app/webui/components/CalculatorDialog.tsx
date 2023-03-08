"use client";
import React from 'react';
import styles from './CalculatorDialog.module.css';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton} from "@mui/material";
import {Close} from "@mui/icons-material"

export interface CalculatorDialogProps {
    title: string;
    handleClose: () => void;
    open: boolean;
    calculator: JSX.Element;
}

export const CalculatorDialog = (props: CalculatorDialogProps): JSX.Element => {
    const {title, handleClose, open, calculator} = props;
    return (
        <Dialog
            maxWidth={'xl'}
            open={open}
        >
            <DialogTitle>
            <div className={styles['dialog-title']}>
                <>{title}</>
                <IconButton
                    edge={'start'}
                    color={'inherit'}
                    onClick={handleClose}
                    aria-label={'close'}
                >
                    <Close />
                </IconButton>
            </div>

            </DialogTitle>
            <DialogContent dividers>
                {calculator}
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleClose}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    )
};

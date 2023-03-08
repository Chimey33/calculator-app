"use client";
import {Inter} from 'next/font/google'
import styles from './page.module.css'
import {PersonalLoans} from "@/app/webui/components/calculators/PersonalLoans";
import {useState} from "react";
import {Button} from "@mui/material";
import {CalculatorDialog} from "@/app/webui/components/CalculatorDialog";
import {WidgetCard} from "@/app/webui/components/WidgetCard";

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main className={styles['main']}>
      <WidgetCard title={'Personal loan'} description={'Cars, loans and holidays'}/>
    </main>
  )
}

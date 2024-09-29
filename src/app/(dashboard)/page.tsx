'use client'
import React from "react";
import { CategorySelected} from "@/components";


export default function Home() {


  return (
    <div className="flex-1 p-4 overflow-y-auto">
        <CategorySelected/>
    </div>
  );
}

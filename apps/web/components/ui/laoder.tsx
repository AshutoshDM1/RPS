"use client";
import { Loader2 } from "lucide-react";

export default function ColorfulSpinningLoader() {
  return (
    <>
      <div className="mt-5 flex flex-col items-center justify-center ">
        <Loader2 className="w-14 h-14 animate-spin text-[#ff3db5] mr-5" />
      </div>
    </>
  );
}

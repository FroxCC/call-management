import { DespedidaForm, InicioForm } from "@/components";
import { Separator } from "@/components/ui/separator";
import React from "react";

export default function EditDespedidaForm() {
  return (
    <div>
      <InicioForm />
      <Separator className="bg-black my-8" />
      <DespedidaForm />
    </div>
  );
}

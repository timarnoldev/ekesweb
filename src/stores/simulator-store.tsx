
import React, {useState} from "react";
import {Creature} from "@/backend/actors/Creature";

export const SelectedCreatureContext = React.createContext<Creature | null>(null);


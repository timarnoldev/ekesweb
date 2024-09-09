import {Button} from "@/components/ui/button";
import {RedoDot} from "lucide-react";

export function SingleStepButton(props: { onClick: () => void, disabled: boolean }) {
    return <Button onClick={props.onClick} disabled={props.disabled}><RedoDot /></Button>;
}
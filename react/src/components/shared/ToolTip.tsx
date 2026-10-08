import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export default function ToolTip({ triger, text }: { triger: any; text: any }) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <div className="text-[0.8rem]">{triger}</div>
            </TooltipTrigger>
            <TooltipContent>
                <p className="text-[0.8rem] max-w-xl text-center">{text}</p>
            </TooltipContent>
        </Tooltip>
    );
}

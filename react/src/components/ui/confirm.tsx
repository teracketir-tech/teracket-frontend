import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Button from "../shared/Button";

export default function Confirm({ children, title, onConfirm, test }: { children: any; title: string; onConfirm?: () => void; test?: boolean }) {
    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>

                    {!test && (
                        <DialogDescription>
                            <span className="block my-3">آیا از انجام این کار اطمینان دارید؟</span>
                        </DialogDescription>
                    )}
                </DialogHeader>

                {test ? (
                    <p className="flex items-center justify-center py-5 text-sm">در حال پیاده سازی !</p>
                ) : (
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button className="bg-transparent! text-[#222529]! border-2 border-[#222529]! h-9">خیر</Button>
                        </DialogClose>

                        <DialogClose asChild>
                            <Button onClick={onConfirm} className="h-9">
                                بله
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    );
}

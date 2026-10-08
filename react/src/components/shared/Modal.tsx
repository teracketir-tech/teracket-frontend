import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

export default function Modal({ title, children, open, setOpen, className = "" }: { title: any; children: any; open: any; setOpen: any; className?: any }) {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className={className}>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>

                {children}
            </DialogContent>
        </Dialog>
    );
}

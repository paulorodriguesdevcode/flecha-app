import { confirmAlert } from "react-confirm-alert";
import Button from "./Button";

type TypeButton = "CANCEL" | "CONFIRM"

interface OpenConfirmationAlertProps {
    title: string,
    question: string,
    classButtonConfirm: TypeButton,
    classButtonCancel: TypeButton,
    confirmMethod: Function,
}
export const openConfirmationAlert = ({ title, question, classButtonConfirm, classButtonCancel, confirmMethod }: OpenConfirmationAlertProps) => {
    confirmAlert({
        customUI: ({ onClose }) => (
            <div className='bg-white dark:bg-black p-6 rounded-lg shadow-lg'>
                <h2 className='text-xl mb-4 text-purple-950 font-bold dark:text-white'>{title}</h2>
                <p className='text-red-500 dark:text-white'>
                    {question}
                </p>
                <div className='mt-6 flex justify-end'>
                    <Button text='Confirmar' type={classButtonConfirm} onClick={() => {confirmMethod(); onClose()} } />
                    <Button text='Cancelar' type={classButtonCancel} onClick={onClose} specialClass='ml-2' />
                </div>
            </div>
        ),
    });
};
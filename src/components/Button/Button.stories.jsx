import Button from './Button'
import {Pen} from 'lucide-react';

export default {
    title: 'Component - Button',
    component: Button,
}

export const ButtonWithIcon = () => <Button icon={Pen} text={'Button'} />
export const ButtonWithoutIcon = () => <Button text={'Button'} />
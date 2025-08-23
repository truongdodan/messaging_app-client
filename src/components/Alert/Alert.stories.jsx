import Alert from "./Alert";

export default {
    title: 'Component - Alert',
    component: Alert,
}

export const Danger = () => <Alert type='DANGR' message={'This is a alert'} />
export const Default = () => <Alert type='DEFAULT' message={'This is a alert'} />
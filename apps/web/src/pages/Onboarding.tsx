import { ConnectKitButton } from 'connectkit';
import { Card, CardBody, Button, Input } from '@chakra-ui/react';
import { ChangeEvent, useState } from 'react';

type Props = {
    login: () => void;
    signup: (walletName: string) => Promise<void>;
};

export const Onboarding = ({ login, signup }: Props) => {
    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    return (
        <Card>
            <CardBody>
                <Button
                    className="h-14 shadow-2xl"
                    background={inputValue ? 'white' : 'gray'}
                    disabled={!inputValue}
                    onClick={() => signup(`LFGHO - ${inputValue}`)}
                >
                    <span className="px-1 text-center font-bold leading-none">
                        Get a wallet
                    </span>
                </Button>
                <Input
                    type="text"
                    placeholder="Stake wallet ..."
                    onChange={handleInputChange}
                    value={inputValue}
                />
                <Button
                    className="h-14 shadow-2xl"
                    background="white"
                    onClick={login}
                >
                    <span className="px-1 text-center font-bold leading-none">
                        Have a wallet?
                    </span>
                </Button>
                <ConnectKitButton />
            </CardBody>
        </Card>
    );
};

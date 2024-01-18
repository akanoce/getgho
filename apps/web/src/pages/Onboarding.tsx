import { Input, ShimmerButton } from '@/components';
import { ConnectKitButton } from 'connectkit';
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
        <div className="flex justify-center items-center">
            <div className="flex flex-col gap-y-4 py-40">
                <ShimmerButton
                    className="h-14 shadow-2xl"
                    shimmerColor="purple"
                    shimmerSize={inputValue ? '0.4em' : '0em'}
                    background={inputValue ? 'white' : 'gray'}
                    disabled={!inputValue}
                    onClick={() => signup(`LFGHO - ${inputValue}`)}
                >
                    <span className="px-1 text-center font-bold leading-none">
                        Get a wallet
                    </span>
                </ShimmerButton>

                <Input
                    label="Name your wallet"
                    type="text"
                    placeholder="Stake wallet ..."
                    onChange={handleInputChange}
                    value={inputValue}
                />

                <ShimmerButton
                    className="h-14 shadow-2xl"
                    shimmerColor="purple"
                    shimmerSize="0.1em"
                    background="white"
                    onClick={login}
                >
                    <span className="px-1 text-center font-bold leading-none">
                        Have a wallet?
                    </span>
                </ShimmerButton>

                <ConnectKitButton />
            </div>
        </div>
    );
};

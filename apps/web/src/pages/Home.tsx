import { Deposit, SendSponsoredTx } from '@/components';
import { Address } from 'viem';
import { UserSummary } from '@/components/UserSummary';
import { ReservesIncentives } from '@/components/ReservesIncentives';
import { Button } from '@chakra-ui/react';

type Props = {
    wallet: Address;
    logout: () => void;
};

export const Home = ({ wallet, logout }: Props) => {
    return (
        <>
            {wallet && (
                <div className="flex flex-col gap-y-4 w-full">
                    <ReservesIncentives address={wallet} />
                    <UserSummary address={wallet} />
                    <Deposit />
                    <SendSponsoredTx />

                    <Button background="white" onClick={logout}>
                        <span className="px-1 text-center font-bold leading-none">
                            Logout
                        </span>
                    </Button>
                </div>
            )}
        </>
    );
};

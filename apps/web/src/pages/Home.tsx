import { Deposit, ShimmerButton } from '@/components';
import { LocalAccount } from 'viem';
import { UserSummary } from '@/components/UserSummary';
import { ReservesIncentives } from '@/components/ReservesIncentives';

type Props = {
    wallet: LocalAccount;
    logout: () => void;
};

export const Home = ({ wallet, logout }: Props) => {
    return (
        <div className="flex justify-center items-center h-[100vh]">
            {wallet && (
                <div className="flex flex-col gap-y-4">
                    <ReservesIncentives address={wallet.address} />
                    <UserSummary address={wallet.address} />
                    <Deposit />
                    <ShimmerButton
                        className="h-14 shadow-2xl"
                        shimmerColor="purple"
                        shimmerSize="0.1em"
                        background="white"
                        onClick={logout}
                    >
                        <span className="px-1 text-center font-bold leading-none">
                            Logout
                        </span>
                    </ShimmerButton>
                </div>
            )}
        </div>
    );
};

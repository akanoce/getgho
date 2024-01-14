import { ShimmerButton } from '../components';

export const Home = ({ wallet }) => {
    console.log('home wallet', wallet);
    return (
        <div className="flex justify-center items-center h-[100vh]">
            {wallet && (
                <div className="flex flex-col gap-y-4">
                    <a>Wallet Address : {JSON.stringify(wallet) ?? ''}</a>
                    <ShimmerButton
                        className="h-14 shadow-2xl"
                        shimmerColor="purple"
                        shimmerSize="0.1em"
                        background="white"
                        onClick={() => {}}
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

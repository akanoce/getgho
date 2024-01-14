import { ShimmerButton } from '../components';
import { useTurnkey } from '../hooks';

export const Home = () => {
    const { wallet, logout } = useTurnkey();

    return (
        <div className="flex justify-center items-center h-[100vh]">
            <a>{JSON.stringify(wallet) ?? ''}</a>
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
    );
};

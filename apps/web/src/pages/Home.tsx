import { Address } from 'viem';
import {
    Button,
    FormControl,
    FormLabel,
    HStack,
    Heading,
    Image,
    Spacer,
    Switch,
    VStack
} from '@chakra-ui/react';
import { SuppliedAssets } from '@/components/SuppliedAssets';
// import { useSponsoredTxFlag } from '@repo/lfgho-sdk';
// import { ChangeEvent, useCallback } from 'react';
import { useAccountAdapter } from '@/hooks/useAccountAdapter';
import { ReservesIncentives } from '@/components/ReservesIncentives';
import { AddressButton } from '@/components';
import { BorrowedAssets } from '@/components/BorrowedAssets';
import { useBalance } from 'wagmi';
import { CryptoIconMap } from '@/const/icons';
import { MergedTable } from '@/components/MergedTable';
import { GetGho } from '@/components/GetGho';
import { GhoData } from '@/components/GhoData';
import { ChangeEvent, useCallback, useState } from 'react';

type Props = {
    wallet: Address;
};

export const Home = ({ wallet }: Props) => {
    // const { setIsSPonsored } = useSponsoredTxFlag();
    const { logout } = useAccountAdapter();

    // const handleOnChange = useCallback(
    //     (event: ChangeEvent<HTMLInputElement>) => {
    //         setIsSPonsored(event.target.checked);
    //     },
    //     [setIsSPonsored]
    // );

    const [showAdvanced, setShowAdvanced] = useState(false);

    const toggleShowAdvanced = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            setShowAdvanced(event.target.checked);
        },
        []
    );

    const { data: balance } = useBalance({ address: wallet });

    return (
        <VStack spacing={4} alignItems={'stretch'} w="full">
            <HStack justifyContent="space-between" w="full">
                <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="advanced" mb="0">
                        Advanced View
                    </FormLabel>
                    <Switch
                        id="advanced"
                        size="lg"
                        onChange={toggleShowAdvanced}
                    />
                </FormControl>
                {/* <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="sponsored" mb="0">
                        Enable ERC20 Sponsored Transactions
                    </FormLabel>
                    <Switch
                        id="sponsored"
                        size="lg"
                        onChange={handleOnChange}
                    />
                </FormControl> */}
                <HStack spacing={8}>
                    <HStack spacing={2}>
                        <AddressButton address={wallet} withCopy={true} />
                        <HStack spacing={2}>
                            <Image
                                src={CryptoIconMap['WETH']}
                                boxSize="1.5rem"
                            />
                            <Heading size="xs">
                                {Number(balance?.formatted ?? 0).toFixed(4)}
                            </Heading>
                        </HStack>
                    </HStack>
                    <Button
                        variant={'solid'}
                        colorScheme="purple"
                        onClick={logout}
                        size="sm"
                    >
                        Logout
                    </Button>
                </HStack>
            </HStack>
            <GetGho address={wallet} />
            <GhoData address={wallet} />
            <MergedTable address={wallet} />
            {showAdvanced && (
                <>
                    <Spacer h={30} />
                    <Heading size="md">Advanced View</Heading>
                    <SuppliedAssets address={wallet} />
                    <BorrowedAssets address={wallet} />
                    <ReservesIncentives address={wallet} />
                </>
            )}
        </VStack>
    );
};

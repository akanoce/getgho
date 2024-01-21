import { Address } from 'viem';
import {
    Button,
    HStack,
    Heading,
    Image,
    Spacer,
    VStack,
    useDisclosure
} from '@chakra-ui/react';
import { SuppliedAssets } from '@/components/SuppliedAssets';
import { useAccountAdapter } from '@/hooks/useAccountAdapter';
import { ReservesIncentives } from '@/components/ReservesIncentives';
import { AddressButton } from '@/components';
import { BorrowedAssets } from '@/components/BorrowedAssets';
import { useBalance } from 'wagmi';
import { CryptoIconMap } from '@/const/icons';
import { GetGhoSimpleFlow } from '@/components/GetGhoSimpleFlow';
import { motion } from 'framer-motion';

type Props = {
    wallet: Address;
};

const bottomToUp = {
    initial: {
        opacity: 0,
        y: 50,
        scale: 0.95,
        rotate: -10 // Slightly rotated when starting
    },
    animate: {
        opacity: 1,
        y: 0,
        scale: 1,
        rotate: 0 // Return to normal state
    },
    exit: {
        opacity: 0,
        y: -50,
        scale: 0.95,
        rotate: 10 // Rotate in opposite direction when exiting
    }
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

    const {
        isOpen: isShowAdvanced,
        onOpen: showAdvanced,
        onClose: hideAdvanced
    } = useDisclosure();

    const { data: balance } = useBalance({ address: wallet });

    return (
        <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={bottomToUp}
            transition={{ duration: 0.5 }}
        >
            <VStack spacing={4} alignItems={'stretch'} w="full">
                <HStack justifyContent="space-between" w="full">
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

                    <HStack spacing={4}>
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

                    <Button onClick={logout} size="sm" colorScheme="purple">
                        Logout
                    </Button>
                </HStack>
                <GetGhoSimpleFlow address={wallet} />
                {!isShowAdvanced && (
                    <Button variant="link" onClick={showAdvanced} size="lg">
                        Feeling advanced?
                    </Button>
                )}
                {/* <GhoData address={wallet} />
            <MergedTable address={wallet} /> */}
                {isShowAdvanced && (
                    <motion.div
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        variants={bottomToUp}
                        transition={{ duration: 0.5 }}
                    >
                        <VStack spacing={4} alignItems={'stretch'} w="full">
                            <Spacer h={30} />
                            <HStack justifyContent="space-between" w="full">
                                <Heading size="md">Advanced View</Heading>
                                <Button variant="link" onClick={hideAdvanced}>
                                    Hide advanced view
                                </Button>
                            </HStack>
                            <SuppliedAssets address={wallet} />
                            <BorrowedAssets address={wallet} />
                            <ReservesIncentives address={wallet} />
                        </VStack>
                    </motion.div>
                )}
            </VStack>
        </motion.div>
    );
};

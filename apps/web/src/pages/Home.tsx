import { Address } from 'viem';
import {
    Box,
    Button,
    HStack,
    Heading,
    Spacer,
    VStack,
    useDisclosure
} from '@chakra-ui/react';
import { SuppliedAssets } from '@/components/SuppliedAssets';
import { ReservesIncentives } from '@/components/ReservesIncentives';
import { BorrowedAssets } from '@/components/BorrowedAssets';
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
    const {
        isOpen: isShowAdvanced,
        onOpen: showAdvanced,
        onClose: hideAdvanced
    } = useDisclosure();

    return (
        <Box
            w="full"
            as={motion.div}
            variants={bottomToUp}
            animate="animate"
            exit="exit"
            initial="initial"
        >
            <VStack spacing={4} alignItems={'stretch'} w="full">
                <GetGhoSimpleFlow address={wallet} />
                {!isShowAdvanced && (
                    <Button variant="link" onClick={showAdvanced} size="lg">
                        Feeling advanced?
                    </Button>
                )}

                {isShowAdvanced && (
                    <Box
                        w="full"
                        as={motion.div}
                        variants={bottomToUp}
                        animate="animate"
                        exit="exit"
                        initial="initial"
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
                    </Box>
                )}
            </VStack>
        </Box>
    );
};

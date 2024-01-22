import { CryptoIconMap } from '@/const/icons';
import { useAccountAdapter } from '@/hooks/useAccountAdapter';
import {
    Button,
    Divider,
    HStack,
    Heading,
    Image,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Tag,
    Text,
    VStack
} from '@chakra-ui/react';
import { AddressButton } from '.';
import { useBalance } from 'wagmi';

type Props = {
    isOpen: boolean;
    onClose: () => void;
};
export const ConnectedAddressModal = ({ isOpen, onClose }: Props) => {
    const { logout, chain, account } = useAccountAdapter();
    const { data: balance } = useBalance({ address: account });
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Connect Wallet</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack spacing={4} divider={<Divider />}>
                        <HStack justify={'space-between'} w="full">
                            <Heading size="xs">Connected Wallet</Heading>
                            {account && (
                                <AddressButton
                                    address={account}
                                    withCopy={true}
                                />
                            )}
                        </HStack>
                        <HStack justify={'space-between'} w="full">
                            <Heading size="xs">Network</Heading>
                            <Tag size="md" variant="solid" colorScheme="purple">
                                <HStack
                                    w="full"
                                    alignItems="center"
                                    spacing={1}
                                >
                                    <Heading size="xs"> {chain?.name}</Heading>
                                    {chain?.testnet && (
                                        <Text as="sub">Testnet</Text>
                                    )}
                                </HStack>
                            </Tag>
                        </HStack>
                        <HStack justify={'space-between'} w="full">
                            <Heading size="xs">Balance</Heading>
                            <HStack spacing={2}>
                                <Image
                                    src={CryptoIconMap['WETH']}
                                    boxSize="1.5rem"
                                />
                                <HStack alignItems="center" spacing={1}>
                                    <Heading size="xs">
                                        {Number(
                                            balance?.formatted ?? 0
                                        ).toFixed(4)}
                                    </Heading>
                                    <Text as="sub" fontSize="2xs">
                                        {chain?.nativeCurrency.symbol}
                                    </Text>
                                </HStack>
                            </HStack>
                        </HStack>
                    </VStack>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={logout} size="sm" colorScheme="purple">
                        Logout
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

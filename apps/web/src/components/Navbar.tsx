import { CryptoIconMap } from '@/const/icons';
import { HStack, Heading, Button, Image, Tag, Text } from '@chakra-ui/react';
import { AddressButton } from '.';
import { useBalance } from 'wagmi';
import { useAccountAdapter } from '@/hooks/useAccountAdapter';

type Props = {
    address: `0x${string}`;
};
export const Navbar: React.FC<Props> = ({ address }) => {
    const { logout, chain } = useAccountAdapter();
    const { data: balance } = useBalance({ address });

    console.log({ chain });

    // const { setIsSPonsored } = useSponsoredTxFlag();

    // const handleOnChange = useCallback(
    //     (event: ChangeEvent<HTMLInputElement>) => {
    //         setIsSPonsored(event.target.checked);
    //     },
    //     [setIsSPonsored]
    // );
    return (
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
                <AddressButton address={address} withCopy={true} />
                <Tag size="md" variant="solid" colorScheme="purple">
                    <HStack w="full" alignItems="center" spacing={1}>
                        <Heading size="xs"> {chain?.name}</Heading>
                        {chain?.testnet && <Text as="sub">Testnet</Text>}
                    </HStack>
                </Tag>
                <HStack spacing={2}>
                    <Image src={CryptoIconMap['WETH']} boxSize="1.5rem" />
                    <HStack alignItems="center" spacing={1}>
                        <Heading size="xs">
                            {Number(balance?.formatted ?? 0).toFixed(4)}
                        </Heading>
                        <Text as="sub" fontSize="2xs">
                            {chain?.nativeCurrency.symbol}
                        </Text>
                    </HStack>
                </HStack>
            </HStack>

            <Button
                onClick={logout}
                size="sm"
                colorScheme="purple"
                variant={'outline'}
            >
                Logout
            </Button>
        </HStack>
    );
};

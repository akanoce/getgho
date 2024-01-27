import React from 'react';
import {
    Checkbox,
    HStack,
    Heading,
    Image,
    Table,
    TableCaption,
    TableContainer,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    VStack,
    useColorModeValue
} from '@chakra-ui/react';
import { CryptoIconMap, genericCryptoIcon } from '@/const/icons';
import { formatAPY, formatBalance } from '@/util/formatting';
import { MergedAsset } from '@/api';

type Props = {
    assets: MergedAsset[];
    selected: string[];
    toggleSelectedAsset: (assetId: string) => () => void;
    tableCaption?: React.ReactNode;
};

export const AssetsTableWithCheckBox: React.FC<Props> = ({
    assets,
    selected,
    toggleSelectedAsset,
    tableCaption
}) => {
    const grayHover = useColorModeValue('gray.100', 'gray.600');
    return (
        <TableContainer>
            <Table variant="simple">
                <TableCaption>{tableCaption}</TableCaption>
                <Thead>
                    <Tr>
                        <Th></Th>
                        <Th>Token</Th>
                        <Th>wallet availability</Th>
                        <Th>Supplied</Th>
                        <Th>Borrowed</Th>
                        <Th>Price</Th>
                        <Th>APY - Supply/Borrow</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {assets.map((asset) => (
                        <Tr
                            key={asset.id}
                            onClick={toggleSelectedAsset(asset.id)}
                            cursor="pointer"
                            _hover={{ bg: grayHover }}
                            transition={'all 0.2s ease-in-out'}
                        >
                            <Td>
                                <Checkbox
                                    colorScheme="purple"
                                    isChecked={selected.includes(asset.id)}
                                />
                            </Td>
                            <Td>
                                <HStack spacing={2}>
                                    <Image
                                        src={
                                            CryptoIconMap[
                                                asset.symbol.toUpperCase()
                                            ] ?? genericCryptoIcon
                                        }
                                        alt={asset.symbol}
                                        boxSize="30px"
                                    />
                                    <Heading size="sm">{asset.name}</Heading>
                                </HStack>
                            </Td>
                            <Td>
                                <VStack
                                    spacing={0}
                                    justify={'flex-start'}
                                    align={'flex-start'}
                                >
                                    <HStack spacing={1}>
                                        <Heading size="sm">
                                            {formatBalance(
                                                asset.availableBalance
                                            )}
                                        </Heading>
                                        <Text size="sm" as="sub">
                                            {asset.symbol}
                                        </Text>
                                    </HStack>
                                    <HStack spacing={1}>
                                        <Heading size="sm">
                                            {formatBalance(
                                                asset.availableBalanceUSD
                                            )}
                                        </Heading>
                                        <Text size="sm" as="sub">
                                            USD
                                        </Text>
                                    </HStack>
                                </VStack>
                            </Td>
                            <Td>
                                <VStack
                                    spacing={0}
                                    justify={'flex-start'}
                                    align={'flex-start'}
                                >
                                    <HStack spacing={1}>
                                        <Heading size="sm">
                                            {formatBalance(
                                                asset.suppliedBalance
                                            )}
                                        </Heading>
                                        <Text size="sm" as="sub">
                                            {asset.symbol}
                                        </Text>
                                    </HStack>
                                    <HStack spacing={1}>
                                        <Heading size="sm">
                                            {formatBalance(
                                                asset.suppliedBalanceUSD
                                            )}
                                        </Heading>
                                        <Text size="sm" as="sub">
                                            USD
                                        </Text>
                                    </HStack>
                                </VStack>
                            </Td>
                            <Td>
                                <VStack
                                    spacing={0}
                                    justify={'flex-start'}
                                    align={'flex-start'}
                                >
                                    <HStack spacing={1}>
                                        <Heading size="sm">
                                            {formatBalance(
                                                asset.borrowedBalance
                                            )}
                                        </Heading>
                                        <Text size="sm" as="sub">
                                            {asset.symbol}
                                        </Text>
                                    </HStack>
                                    <HStack spacing={1}>
                                        <Heading size="sm">
                                            {formatBalance(
                                                asset.borrowedBalanceUSD
                                            )}
                                        </Heading>
                                        <Text size="sm" as="sub">
                                            USD
                                        </Text>
                                    </HStack>
                                </VStack>
                            </Td>
                            <Td>
                                <Heading size="sm">
                                    {new Intl.NumberFormat('it-IT', {
                                        style: 'currency',
                                        currency: 'USD'
                                    }).format(Number(asset.price))}
                                </Heading>
                            </Td>

                            <Td>
                                <VStack
                                    spacing={0}
                                    justify={'flex-start'}
                                    align={'flex-start'}
                                >
                                    <Heading size="sm" color="green">
                                        S {formatAPY(asset.supplyAPY)}
                                    </Heading>
                                    <Heading size="sm" color="orange">
                                        B {formatAPY(asset.borrowAPY)}
                                    </Heading>
                                </VStack>
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </TableContainer>
    );
};

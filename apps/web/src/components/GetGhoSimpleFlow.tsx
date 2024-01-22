import {
    useGhoData,
    useMergedTableData,
    useReserves,
    useUserReservesIncentives
} from '@/api';
import { CryptoIconMap } from '@/const/icons';
import { formatBalance } from '@/util/formatting';
import { Card, CardBody } from '@chakra-ui/card';
import {
    Button,
    CardHeader,
    Divider,
    HStack,
    Heading,
    Icon,
    Image,
    Link,
    Spacer,
    Text,
    VStack,
    useMediaQuery
} from '@chakra-ui/react';
import { useMemo, useState } from 'react';
import { AssetsTableWithCheckBox } from './AssetsTableWithCheckBox';
import { useMultipleSupplyWithBorrow } from '@/hooks/useMultipleSupplyWithBorrow';
import { useBorrowAsset } from '@/hooks/useBorrowAsset';
import { AssetToSupplySimpleClickableCard } from '@/AssetToSupplySimpleClickableCard';
import { FaLink } from 'react-icons/fa6';

export const GetGhoSimpleFlow = ({ address }: { address: string }) => {
    const [isDesktop] = useMediaQuery('(min-width: 768px)');
    const { data: userReserves } = useUserReservesIncentives(address);
    const { data: reserves } = useReserves();

    const ghoData = useGhoData(address);

    const ghoReserve = useMemo(
        () =>
            reserves?.formattedReserves.find(
                (reserve) => reserve.symbol.toUpperCase() === 'GHO'
            ),
        [reserves?.formattedReserves]
    );

    const totalGhoBalance = useMemo(
        () => ghoData?.borrowedBalanceUSD,

        [ghoData]
    );

    const renderAvailableCollateral = useMemo(() => {
        const formattedAvailableToBorrow = formatBalance(
            userReserves?.formattedUserSummary.availableBorrowsUSD ?? '0'
        );
        if (formattedAvailableToBorrow !== '0')
            return (
                <VStack spacing={1} align={'flex-end'}>
                    <Heading size={'sm'}>Available collateral</Heading>
                    <HStack spacing={1}>
                        <Heading size="md">
                            {formattedAvailableToBorrow}
                        </Heading>
                        <Text as="sub" size="sm">
                            USD
                        </Text>
                    </HStack>
                </VStack>
            );
    }, [userReserves]);

    const { data: assetsData } = useMergedTableData({ address });

    const availableBalance = useMemo(
        () =>
            assetsData?.reduce(
                (acc, asset) => acc + Number(asset.availableBalanceUSD),
                0
            ),
        [assetsData]
    );

    const [selectedAssetsId, setSelectedAssetsId] = useState<string[]>([]);

    const selectedAssets = useMemo(
        () =>
            assetsData?.filter((asset) =>
                selectedAssetsId.includes(asset.id)
            ) ?? [],
        [assetsData, selectedAssetsId]
    );

    const totalSupplyUsdSelected = useMemo(
        () =>
            selectedAssets.reduce(
                (acc, asset) => acc + Number(asset?.availableBalanceUSD ?? 0),
                0
            ),
        [selectedAssets]
    );

    const { mutate: multipleSupplyAndBorrow, isSupplyTxLoading } =
        useMultipleSupplyWithBorrow({
            toBorrow: ghoReserve,
            toSupply: selectedAssets.map((asset) => ({
                reserve: reserves?.formattedReserves.find(
                    (reserve) => reserve.id === asset.id
                ),
                amount: asset.availableBalance,
                amountInUsd: asset.availableBalanceUSD
            }))
        });

    const availableToBorrowInGho = useMemo(
        () =>
            (Number(
                userReserves?.formattedUserSummary.availableBorrowsUSD ?? 0
            ) /
                Number(ghoReserve?.priceInUSD ?? 0)) *
            Number(userReserves?.formattedUserSummary.currentLoanToValue),
        [userReserves, ghoReserve]
    );

    const { mutate: borrowGho, isSupplyTxLoading: isBorrowGhoLoading } =
        useBorrowAsset({
            reserve: ghoReserve?.underlyingAsset,
            amount: availableToBorrowInGho.toString()
        });

    const tableCaption = useMemo(() => {
        return (
            <VStack spacing={1} justifyContent={'center'} divider={<Divider />}>
                <VStack spacing={1}>
                    <Button
                        colorScheme="purple"
                        isDisabled={totalSupplyUsdSelected === 0}
                        onClick={() => multipleSupplyAndBorrow()}
                        isLoading={isSupplyTxLoading}
                    >
                        Get GHO
                    </Button>
                    <HStack spacing={1}>
                        <Text fontSize={'xs'}>using an additional</Text>

                        <Heading size="xs">
                            {totalSupplyUsdSelected.toFixed(2)}
                        </Heading>
                        <Text fontSize={'xs'}>USD</Text>
                    </HStack>
                </VStack>
                <Button
                    size="sm"
                    variant={'link'}
                    isDisabled={availableToBorrowInGho <= 0}
                    onClick={() => borrowGho()}
                    isLoading={isBorrowGhoLoading}
                >
                    Get GHO using your available collateral
                </Button>
            </VStack>
        );
    }, [
        totalSupplyUsdSelected,
        isSupplyTxLoading,
        multipleSupplyAndBorrow,
        borrowGho,
        isBorrowGhoLoading,
        availableToBorrowInGho
    ]);

    const assetsDataWithAvailableBalance = useMemo(
        () =>
            assetsData?.filter(
                (asset) => Number(asset.availableBalanceUSD) !== 0
            ),
        [assetsData]
    );

    const toggleSelectedAsset = (assetId: string) => () => {
        setSelectedAssetsId((prev) =>
            prev.includes(assetId)
                ? prev.filter((id) => id !== assetId)
                : [...prev, assetId]
        );
    };

    return (
        <Card>
            <CardHeader>
                <HStack w="full" justify="space-between">
                    <VStack spacing={1} align="flex-start">
                        <Heading size={'md'}>Your GHO</Heading>
                        <HStack spacing={2}>
                            <Heading size="lg">
                                {Number(totalGhoBalance ?? '0').toFixed(2)}
                            </Heading>
                            <Image src={CryptoIconMap['GHO']} boxSize="2rem" />
                        </HStack>
                    </VStack>
                    {renderAvailableCollateral}
                </HStack>
            </CardHeader>
            <CardBody w="full" display="flex" flexDir={'column'} gap={4}>
                {assetsDataWithAvailableBalance?.length === 0 ? (
                    <VStack spacing={4}>
                        <Button
                            size="sm"
                            colorScheme="purple"
                            isDisabled={availableToBorrowInGho <= 0}
                            onClick={() => borrowGho()}
                            isLoading={isBorrowGhoLoading}
                        >
                            Get GHO using your available collateral
                        </Button>
                        <VStack spacing={1} divider={<Divider />}>
                            <VStack spacing={1}>
                                <Heading size={'sm'}>
                                    You don't have any assets to supply
                                </Heading>
                                <Link
                                    fontSize={'sm'}
                                    textAlign={'center'}
                                    href="https://staging.aave.com/faucet/"
                                    isExternal
                                >
                                    <Icon as={FaLink} mx="2px" />
                                    Get some of these using the official faucet{' '}
                                </Link>
                            </VStack>
                            <Text fontSize={'xs'}>
                                Fiat on-ramp coming soon on mainnet
                            </Text>
                        </VStack>
                    </VStack>
                ) : (
                    <>
                        <Heading size={['sm']}>
                            You could get up to{' '}
                            <Text as="u">
                                {availableBalance.toFixed(2)} GHO
                            </Text>
                            {` `}
                            supplying more assets
                        </Heading>
                        {isDesktop ? (
                            <AssetsTableWithCheckBox
                                assets={assetsDataWithAvailableBalance}
                                selected={selectedAssetsId}
                                toggleSelectedAsset={toggleSelectedAsset}
                                tableCaption={tableCaption}
                            />
                        ) : (
                            <VStack spacing={2} w="full">
                                {assetsDataWithAvailableBalance?.map(
                                    (asset) => (
                                        <AssetToSupplySimpleClickableCard
                                            key={asset.id}
                                            asset={asset}
                                            isSelected={selectedAssetsId.includes(
                                                asset.id
                                            )}
                                            toggleSelected={toggleSelectedAsset(
                                                asset.id
                                            )}
                                        />
                                    )
                                )}
                                <Spacer h={4} />
                                {tableCaption}
                            </VStack>
                        )}
                    </>
                )}
            </CardBody>
        </Card>
    );
};

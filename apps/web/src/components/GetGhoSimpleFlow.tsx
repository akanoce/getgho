import {
    useGhoData,
    useMergedTableData,
    useReservesIncentives,
    useUserReservesIncentives
} from '@/api';
import { CryptoIconMap } from '@/const/icons';
import { useMultipleSupplyWithBorrow } from '@/hooks/useMultipleSupplyWithBorrow';
import { formatBalance } from '@/util/formatting';
import { Card, CardBody } from '@chakra-ui/card';
import {
    Button,
    CardHeader,
    HStack,
    Heading,
    Image,
    Text,
    VStack
} from '@chakra-ui/react';
import { useCallback, useMemo, useState } from 'react';
import { formatUnits } from 'viem';
import { erc20ABI, useContractReads } from 'wagmi';
import { AssetsTableWithCheckBox } from './AssetsTableWithCheckBox';

export const GetGhoSimpleFlow = ({ address }: { address: string }) => {
    const { data: reservesIncentives } = useReservesIncentives();
    const { data: userReserves } = useUserReservesIncentives(address);

    const ghoReserve = reservesIncentives?.formattedReservesIncentives.find(
        (reserve) => reserve.symbol === 'GHO'
    );

    const { data: userBalances } = useContractReads({
        allowFailure: false,
        contracts: reservesIncentives?.formattedReservesIncentives.map(
            (reserveIncentive) => ({
                address: reserveIncentive.underlyingAsset as `0x${string}`,
                abi: erc20ABI,
                functionName: 'balanceOf',
                args: [address]
            })
        )
    });
    const getUserBalance = useCallback(
        (assetIndex: number, decimals: number) => {
            const balance = userBalances?.[assetIndex] as bigint;
            if (!balance) return '0';

            const parsedBalance = formatUnits(balance, decimals);

            return parsedBalance;
        },
        [userBalances]
    );
    const reservesWithBalance = useMemo(
        () =>
            reservesIncentives?.formattedReservesIncentives.map(
                (reserve, index) => ({
                    ...reserve,
                    balance: getUserBalance(index, reserve.decimals ?? 18),
                    underlyingBalanceUSD:
                        Number(reserve.priceInUSD) *
                        Number(getUserBalance(index, reserve.decimals ?? 18))
                })
            ) ?? [],
        [reservesIncentives, getUserBalance]
    );
    const availableReservesWithBalance = useMemo(
        () =>
            reservesWithBalance
                ?.filter((reserve) => reserve.balance !== '0')
                .map((reserve) => ({
                    reserve,
                    amount: reserve.balance,
                    amountInUsd: reserve.underlyingBalanceUSD
                })) ?? [],
        [reservesWithBalance]
    );

    const availableSuppliableReservesWithBalance = useMemo(
        () =>
            availableReservesWithBalance.filter(
                (reserve) => reserve.reserve.supplyCap !== '0'
            ),
        [availableReservesWithBalance]
    );
    const { mutate: multipleSupplyAndBorrow, isSupplyTxLoading } =
        useMultipleSupplyWithBorrow({
            toBorrow: ghoReserve,
            toSupply: availableSuppliableReservesWithBalance
        });

    const ghoData = useGhoData(address);

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

    const assetsData = useMergedTableData({ address });

    const availableBalance = useMemo(
        () =>
            assetsData?.reduce(
                (acc, asset) => acc + Number(asset.availableBalanceUSD),
                0
            ),
        [assetsData]
    );

    const [selectedAssets, setSelectedAssets] = useState<string[]>([]);

    const totalSupplyUsdSelected = useMemo(
        () =>
            selectedAssets.reduce(
                (acc, asset) =>
                    acc +
                    Number(
                        assetsData?.find((data) => data.id === asset)
                            ?.availableBalanceUSD ?? 0
                    ),
                0
            ),
        [selectedAssets, assetsData]
    );

    const tableCaption = useMemo(
        () => (
            <Button
                isDisabled={totalSupplyUsdSelected === 0}
                onClick={() => multipleSupplyAndBorrow()}
                isLoading={isSupplyTxLoading}
            >
                Get GHO using an additional {totalSupplyUsdSelected.toFixed(2)}{' '}
                USD worth of assets
            </Button>
        ),
        [totalSupplyUsdSelected, isSupplyTxLoading, multipleSupplyAndBorrow]
    );

    const assetsDataWithAvailableBalance = useMemo(
        () =>
            assetsData?.filter(
                (asset) => Number(asset.availableBalanceUSD) !== 0
            ),
        [assetsData]
    );
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
                <Heading size="md">
                    You could get up to{' '}
                    <Text as="u">{availableBalance.toFixed(2)} GHO</Text>
                    {` `}
                    supplying more assets
                </Heading>
                <AssetsTableWithCheckBox
                    assets={assetsDataWithAvailableBalance}
                    selected={selectedAssets}
                    setSelected={setSelectedAssets}
                    tableCaption={tableCaption}
                />
            </CardBody>
        </Card>
    );
};

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
    HStack,
    Heading,
    Image,
    Text,
    VStack
} from '@chakra-ui/react';
import { useMemo, useState } from 'react';
import { AssetsTableWithCheckBox } from './AssetsTableWithCheckBox';
import { useMultipleSupplyWithBorrow } from '@/hooks/useMultipleSupplyWithBorrow';

export const GetGhoSimpleFlow = ({ address }: { address: string }) => {
    const { data: userReserves } = useUserReservesIncentives(address);
    const { data: reserves } = useReserves();

    const ghoData = useGhoData(address);

    const ghoReserve = useMemo(
        () =>
            reserves?.formattedReserves.find(
                (reserve) => reserve.name === 'GHO'
            ),
        [userReserves]
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

    const assetsData = useMergedTableData({ address });

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
                )?.underlyingAsset,
                amount: asset.availableBalance,
                amountInUsd: asset.availableBalanceUSD
            }))
        });

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
                    selected={selectedAssetsId}
                    setSelected={setSelectedAssetsId}
                    tableCaption={tableCaption}
                />
            </CardBody>
        </Card>
    );
};

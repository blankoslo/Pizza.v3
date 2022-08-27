import React from 'react';
import Button from '@mui/material/Button';
import { Box, Paper, Typography } from '@mui/material';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { postRestaurant, ApiRestaurantPost, restaurantsDefaultQueryKey } from '../../../../api/RestaurantService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import TextInput from '../../../TextInput';
import { useStore } from '../../../../state/store';

const validationSchema = yup.object().shape({
    name: yup
        .string()
        .min(1, i18n.t('restaurants.new.validation.name.min'))
        .required(i18n.t('restaurants.new.validation.name.required')),
    link: yup.string(),
    tlf: yup.string(),
    address: yup.string(),
});

export const RestaurantCreator: React.FC = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const [state] = useStore();

    const formMethods = useForm<ApiRestaurantPost>({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            name: '',
            link: '',
            tlf: '',
            address: '',
        },
    });

    const addRestaurantMutation = useMutation(
        (newRestaurant: ApiRestaurantPost) => postRestaurant(newRestaurant, state.user?.token),
        {
            onSuccess: () => {
                toast.success(t('restaurants.new.mutation.onSuccess'));
                formMethods.reset();
            },
            onError: () => {
                toast.error(t('restaurants.new.mutation.onError'));
            },
            onSettled: () => {
                queryClient.invalidateQueries([restaurantsDefaultQueryKey]);
            },
        },
    );

    const onSubmit = formMethods.handleSubmit(async (data) => {
        const newRestaurant: ApiRestaurantPost = {
            name: data.name,
        };
        if (data.link !== '') {
            newRestaurant.link = data.link;
        }
        if (data.tlf !== '') {
            newRestaurant.tlf = data.tlf;
        }
        if (data.address !== '') {
            newRestaurant.address = data.address;
        }
        addRestaurantMutation.mutate(newRestaurant);
    });

    return (
        <FormProvider {...formMethods}>
            <Paper
                component="form"
                onSubmit={onSubmit}
                sx={(theme) => ({
                    padding: 1,
                    width: '30vw',
                    minWidth: '500px',
                    backgroundColor: theme.palette.secondary.main,
                    borderRadius: 3,
                })}
            >
                <Typography
                    variant="h5"
                    component="h2"
                    align="center"
                    sx={{
                        marginBottom: 1,
                        color: '#171717',
                    }}
                >
                    {t('restaurants.new.title')}
                </Typography>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        color: '#ffffff',
                    }}
                >
                    <TextInput name="name" label={t('restaurants.new.form.name')} type="text" />
                    <TextInput name="link" label={t('restaurants.new.form.link')} type="text" />
                    <TextInput name="tlf" label={t('restaurants.new.form.tlf')} type="text" />
                    <TextInput name="address" label={t('restaurants.new.form.address')} type="text" />
                    <Button variant="contained" color="success" type="submit">
                        {t('restaurants.new.form.button')}
                    </Button>
                </Box>
            </Paper>
        </FormProvider>
    );
};

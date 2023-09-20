import useSWR from "swr";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { useMountedState } from "react-use";
import { useForm, useFieldArray } from "react-hook-form";

import { useState, useCallback, useEffect, useMemo } from "react";

import { Grid, Typography, Stack } from "@mui/material";

import get from "lodash/get";
import find from "lodash/find";
import groupBy from "lodash/groupBy";
import isEmpty from "lodash/isEmpty";

import {
  BackButton,
  LoadingButton,
  Checkbox,
  LoadingDynamic as Loading,
  CheckboxItem,
} from "components";

import DynamicMessage from "messages";
import { USERS, DETAIL } from "routes";
import { PERMISSION, USER_PERMISSION } from "apis";
import { useChoice, useNotification } from "hooks";
import { USER_PERMISSION_ITEM, PERMISSION_ITEM } from "interfaces";
import { userPermissionSchema, UserPermissionSchemaProps } from "yups";
import { checkResArr, transformUrl, createRequest, deleteRequest } from "libs";

const AssignPermissionDialog = () => {
  const router = useRouter();

  const [defaultValues, setDefaultValues] = useState<UserPermissionSchemaProps>();

  const { data: userPermissionData, mutate: userPermissionMutate } = useSWR<
    USER_PERMISSION_ITEM[]
  >(() => {
    const params = {
      user: router.query?.ids?.[0],
      use_cache: false,
      get_all: true,
    };

    return transformUrl(`${USER_PERMISSION}`, params);
  });

  const { data: permissionData } = useSWR<PERMISSION_ITEM[]>(() => {
    const params = {
      get_all: true,
    };
    return transformUrl(PERMISSION, params);
  });

  useEffect(() => {
    if (permissionData == undefined || userPermissionData == undefined) {
      return;
    }

    const transformedUserPermissionData = userPermissionData.map((el) => {
      const permissionId = el.id;
      const id = get(el, "permission.id");

      return { id, permissionId, checked: true, defaultChecked: true };
    });

    const data = permissionData.map((el) => {
      const extraData = find(transformedUserPermissionData, { id: el.id }) || {};
      return { ...el, checked: false, ...extraData };
    });

    setDefaultValues({
      permissions: data,
    });
  }, [permissionData, userPermissionData]);

  const onSuccessHandler = useCallback(async () => {
    await userPermissionMutate();

    router.push(`/${USERS}/${DETAIL}/${router.query?.ids?.[0]}`);

    setDefaultValues(undefined);
  }, []);

  if (defaultValues == undefined) return <Loading />;

  return <RootComponent {...{ defaultValues, onSuccessHandler }} />;
};

interface RootComponentProps {
  defaultValues: UserPermissionSchemaProps;
  onSuccessHandler: () => Promise<void>;
}

const RootComponent = ({ defaultValues, onSuccessHandler }: RootComponentProps) => {
  const isMounted = useMountedState();

  const router = useRouter();
  const { loading, setLoading, enqueueSnackbarWithSuccess, enqueueSnackbarWithError } =
    useNotification();

  const { formatMessage, messages } = useIntl();

  const choice = useChoice();

  const { control, handleSubmit } = useForm({
    defaultValues,
    resolver: userPermissionSchema(),
  });

  const { fields, update } = useFieldArray({
    name: "permissions",
    control,
    keyName: "formId",
  });

  const onSubmit = useCallback(
    async ({ data }: { data: UserPermissionSchemaProps["permissions"] }) => {
      try {
        // console.log(data);

        return;

        const userId = get(router, "query.ids[0]");

        const createList: any[] = [];
        const deleteList: any[] = [];

        data.forEach((el) => {
          if (el.permissionId && !el.checked) {
            deleteList.push(el.permissionId);
          }

          if (el.checked && !el.permissionId) {
            createList.push({
              permission: el.id,
              user: userId,
            });
          }
        });

        setLoading(true);

        let resList: any[] = [];

        if (!isEmpty(createList)) {
          const results = await createRequest(USER_PERMISSION, createList);

          resList = [...resList, ...results];
        }

        if (!isEmpty(deleteList)) {
          const results = await deleteRequest(USER_PERMISSION, deleteList);

          resList = [...resList, ...results];
        }

        const result = checkResArr(resList);

        if (result) {
          enqueueSnackbarWithSuccess(
            formatMessage(DynamicMessage.updateSuccessfully, {
              content: "phân quyền",
            })
          );

          onSuccessHandler();
        }
      } catch (err) {
        enqueueSnackbarWithError(err);
      } finally {
        if (isMounted()) {
          setLoading(false);
        }
      }
    },
    []
  );

  const transformedData = useMemo(() => {
    const dataWithIndex = fields.map((el, idx) => {
      return { ...el, index: idx };
    });
    return groupBy(dataWithIndex, "content_type");
  }, [fields]);

  const { permission_content_types } = choice;

  return (
    <Grid container marginTop={2} justifyContent="flex-start">
      {Object.keys(transformedData).map((key, idx) => {
        const el = find(permission_content_types, { 0: key });

        return (
          <Grid item xs={4} key={idx}>
            <Typography
              variant="h6"
              sx={{
                cursor: "pointer",
              }}
              onClick={() => {
                transformedData[key].forEach((el) => {
                  update(el.index, { ...el, checked: true });
                });
              }}
            >
              {el?.[1]}
            </Typography>
            {transformedData[key].map((el) => {
              return (
                <Checkbox
                  key={el.formId}
                  renderItem={() => {
                    return (
                      <CheckboxItem
                        label={el.name}
                        CheckboxProps={{
                          checked: el.checked,
                          onChange: (e) => {
                            update(el.index, { ...el, checked: e.target.checked });
                          },
                        }}
                      />
                    );
                  }}
                />
              );
            })}
          </Grid>
        );
      })}
      <Grid item xs={12}>
        <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
          <BackButton
            onClick={() => {
              router.push(`/${USERS}/${DETAIL}/${router.query?.ids?.[0]}`);
            }}
            disabled={loading}
          />
          <LoadingButton
            onClick={handleSubmit((data) => {
              const { permissions } = data;
              onSubmit({ data: permissions });
            })}
            loading={loading}
            disabled={loading}
          >
            {loading ? messages["updatingStatus"] : messages["updateStatus"]}
          </LoadingButton>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default AssignPermissionDialog;

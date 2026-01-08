// @ts-ignore
/* eslint-disable */
import { request } from "@umijs/max";

/** get21DaysData GET /api/traffic/21days/${param0} */
export async function get21DaysDataUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.get21DaysDataUsingGETParams,
  options?: { [key: string]: any }
) {
  const { city: param0, ...queryParams } = params;
  return request<API.TrafficHistory[]>(`/api/traffic/21days/${param0}`, {
    method: "GET",
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** predict7DaysTraffic POST /api/traffic/predict7d */
export async function predict7DaysTrafficUsingPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.predict7DaysTrafficUsingPOSTParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseString_>("/api/traffic/predict7d", {
    method: "POST",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

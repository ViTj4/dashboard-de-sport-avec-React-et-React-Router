import { createServiceError } from "../errors/ServiceError.js";

export function mapUserInfo(data) {
  const profile       = data?.profile;
  const statistics    = data?.statistics;
  const rawDistance   = statistics?.totalDistance;
  const totalDistance = typeof rawDistance === "number" ||
    (typeof rawDistance === "string" && rawDistance.trim() !== "")
    ? Number(rawDistance)
    :  Number.NaN;

  if (
    typeof profile?.firstName !== "string" ||
    typeof profile?.lastName  !== "string" ||
    !Number.isFinite(totalDistance) || totalDistance < 0 ||
    !Number.isInteger(statistics?.totalSessions) || statistics.totalSessions < 0 ||
    !Number.isFinite(statistics?.totalDuration) || statistics.totalDuration < 0
  ) {
    throw createServiceError("Invalid user information response.", {
      code: "INVALID_RESPONSE",
    });
  }

  return {
    firstName     : profile.firstName,
    lastName      : profile.lastName,
    createdAt     : profile.createdAt,
    age           : profile.age,
    weight        : profile.weight,
    height        : profile.height,
    profilePicture: profile.profilePicture,
    statistics    : {
      totalDistance,
      totalSessions: statistics.totalSessions,
      totalDuration: statistics.totalDuration,
    },
  };
}

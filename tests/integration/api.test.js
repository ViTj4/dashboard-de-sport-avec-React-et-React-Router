import test                     from "node:test";
import assert                   from "node:assert/strict";
import { createApiRepository }  from "../../app/services/repositories/apiRepository.server.js";
import { createMockRepository } from "../../app/mocks/mockRepository.server.js";
import { env }                  from "../../app/config/env.server.js";

test("real API and mock share profiles, statistics and historical activities", async () => {
  const api  = createApiRepository({ baseURL: env.apiBaseUrl });
  const mock = createMockRepository();

  for (const [username, password] of [
    ["sophiemartin", "password123"],
    ["emmaleroy", "password789"],
    ["marcdubois", "password456"],
  ]) {
    const credentials                = { username, password };
    const [realSession, mockSession] = await Promise.all([api.login(credentials), mock.login(credentials)]);
    const [realInfo, mockInfo]       = await Promise.all([
      api.getUserInfo(realSession.token), mock.getUserInfo(mockSession.token),
    ]);
    assert.equal(realSession.userId, mockSession.userId);
    assert.deepEqual(realInfo.statistics, mockInfo.statistics);
    const { profilePicture: realPicture, ...realProfile } = realInfo.profile;
    const { profilePicture: mockPicture, ...mockProfile } = mockInfo.profile;
    assert.deepEqual(realProfile, mockProfile);
    assert.ok(realPicture && mockPicture);
    const range = { startWeek: "2025-01-01", endWeek: "2025-01-31" };
    assert.deepEqual(await api.getUserActivity(realSession.token, range),
      await mock.getUserActivity(mockSession.token, range));
  }
  await assert.rejects(api.login({ username: "sophiemartin", password: "wrong" }), { status: 401 });
  await assert.rejects(api.getUserInfo("invalid-token"), { status: 403 });
});

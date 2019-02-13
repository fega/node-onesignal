import test from 'ava'
import { OneSignal } from '.'
import { apiKey, appId, playerId } from './credentials.ignore'

const onesignal = new OneSignal(apiKey, appId)

test('Onesignal#send', async (t) => {
  const r = await onesignal.send(playerId, 'hello')

  t.truthy(r)
})
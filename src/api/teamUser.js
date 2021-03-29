import request from '@/utils/request'

export function getTeamsUser() {
  return request({
    url: '/teamUser/getTeamUser',
    method: 'get'
  })
}


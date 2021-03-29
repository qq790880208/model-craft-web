import Mock from 'mockjs'

const Users = []
const Teams = []

for (let i = 0; i < 30; i++) {
  Users.push(Mock.mock({
    id: Mock.Random.guid(),
    name: Mock.Random.cname(),
    character: Mock.Random.integer(1, 3),
    message: Mock.mock('@county(true)')
  }))
}

for (let i = 0; i < 5; i++) {
  Teams.push(Mock.mock({
    id: Mock.Random.guid(),
    name: Mock.Random.cname(),
    message: Mock.mock('@county(true)')
  }))
}

export { Teams, Users }

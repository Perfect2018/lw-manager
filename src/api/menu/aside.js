import api from '../../config/api'

export function listTree() {
  return api._post('/lw-manager/bcars_app/shopstate/getBrandShop');
}

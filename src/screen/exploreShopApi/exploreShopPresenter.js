import {endPoint} from '../../api/apiEndPoint';
import {ApiServices} from '../../api/ApiServices';
import {LinkStoreView} from './exploreShopView';

export const linkStoreData = (linkStoreView: LinkStoreView, data: FormData) => {
  console.log('id of product', data);
  ApiServices.postUser(endPoint.send_request_to_store, data)
    .then(result => {
      console.log('result of link store', result);

      linkStoreView.linkStoreSuccess(result);
    })
    .catch(err => {});
};

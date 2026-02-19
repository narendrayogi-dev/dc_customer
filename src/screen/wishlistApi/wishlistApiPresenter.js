import {endPoint} from '../../api/apiEndPoint';
import {ApiServices} from '../../api/ApiServices';
import {WishlistDeleteView} from './wishlistApiView';

export const WishlistDeleteData = (
  wishlistDeleteView: WishlistDeleteView,
  data: FormData,
) => {
  ApiServices.postUser(endPoint.delete_wishlist_items, data)
    .then(result => {
      console.log('get api data result', result);

      wishlistDeleteView.wishlistDeleteSuccess(result);
    })
    .catch(err => {
      console.log('errror of api', err);
    });
};

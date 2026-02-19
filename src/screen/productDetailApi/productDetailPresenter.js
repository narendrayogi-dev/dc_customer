import {endPoint} from '../../api/apiEndPoint';
import {ApiServices} from '../../api/ApiServices';
import {ProductDetailView} from './productDetailView';

export const ProductDetailData = (
  productDetailView: ProductDetailView,
  data: any,
) => {
  console.log('id of product deatil', data);
  ApiServices.get(endPoint.product_detail, 22325)
    .then(result => {
      console.log('result of product detail ', result);
      productDetailView.productDetailSuccess(result);
    })
    .catch(err => {
      console.log('err of product detail ', err);
    });
};

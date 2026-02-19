import {endPoint} from '../../api/apiEndPoint';
import {ApiServices} from '../../api/ApiServices';
import {
  ReturnProductView,
  ReturnProductSubmitView,
  ReturnProductDeleteView,
} from './returnProductView';

export const returnProductData = (returnProductView: ReturnProductView) => {
  ApiServices.get(endPoint.customer_return_product)
    .then(result => {
      console.log('returnProductView rsult show', result);
      returnProductView.returnProductSuccess(result);
    })
    .catch(err => {});
};
export const returnProductData2 = (
  returnProductSubmitView: ReturnProductSubmitView,
  data: FormData,
) => {
  ApiServices.postUser(endPoint.customer_return_product, data)
    .then(result => {
      console.log('returnProductView 454 result', result);
      returnProductSubmitView.returnProductSubmitSuccess(result);
    })
    .catch(err => {
      console.log('error of return product', err);
    });
};

export const returnProductDeleteData = (
  returnProductDeleteView: ReturnProductDeleteView,
  data: any,
) => {
  console.log('id of product', data);
  ApiServices.postUser(endPoint.customer_return_product_delete, data)
    .then(result => {
      console.log('returnProductView delete', result);
      returnProductDeleteView.returnProductDeleteSuccess(result);
    })
    .catch(err => {
      console.log('error of delete return product', err);
    });
};

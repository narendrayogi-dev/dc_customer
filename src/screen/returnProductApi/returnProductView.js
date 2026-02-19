export interface ReturnProductView {
  returnProductSuccess: (result: any) => void;
  returnProductFailure: (err: any) => void;
}

export interface ReturnProductSubmitView {
  returnProductSubmitSuccess: (result: any) => void;
  returnProductSubmitFailure: (err: any) => void;
}

export interface ReturnProductDeleteView {
  returnProductDeleteSuccess: (result: any) => void;
  returnProductDeleteFailure: (err: any) => void;
}

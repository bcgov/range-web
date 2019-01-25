//
// MyRangeBC
//
// Copyright © 2018 Province of British Columbia
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// Created by Kyubin Han.
//

import axios from 'axios';
import { API_BASE_URL } from '../constants/api';

const instance = axios.create({
  baseURL: API_BASE_URL,
});

instance.interceptors.response.use(response => (
  response
), (error) => {
  return Promise.reject(error && error.response);
});

export default instance;

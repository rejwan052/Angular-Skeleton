import { Department } from '../../_core/models/department';

export interface IDepartmentResponse {
    total: number;
    results: Department[];
}

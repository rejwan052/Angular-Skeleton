import { Designation } from '../../_core/models/designation';

export interface IDesignationResponse {
    total: number;
    results: Designation[];
}

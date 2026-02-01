<?php

/*
 * This file is part of foskym/flarum-pagination.
 *
 * Copyright (c) 2024 FoskyM.
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */

namespace FoskyM\Pagination\Filter;

use Flarum\Filter\FilterState;
use Flarum\Query\QueryCriteria;
use FoskyM\Pagination\TotalResultsCount;

class Filter
{
    public function __invoke(FilterState $filter, QueryCriteria $queryCriteria)
    {
        // Clone the query to avoid modifying the original
        $query = clone $filter->getQuery();

        // Remove limit and offset to get total count
        // Using Query Builder methods instead of raw SQL manipulation
        $query->limit(null)->offset(null);

        // Get count using Query Builder's count method (safe, parameterized)
        $count = $query->getCountForPagination();

        // Store in our thread-safe container
        TotalResultsCount::set($count);
    }
}
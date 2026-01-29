<?php

/*
 * This file is part of foskym/flarum-pagination.
 *
 * Copyright (c) 2024 FoskyM.
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */

namespace FoskyM\Pagination;

use Flarum\Api\Controller\AbstractSerializeController;
use Psr\Http\Message\ServerRequestInterface as Request;
use Tobscure\JsonApi\Document;

class LoadPagination
{
    public function __invoke(AbstractSerializeController $controller, $data, Request $request, Document $document)
    {
        // Try to get count from our container first
        $count = TotalResultsCount::get();

        if ($count !== null) {
            $document->setJsonapi(['totalResultsCount' => $count]);
            // Reset for next request
            TotalResultsCount::reset();
        } elseif (is_object($data) && property_exists($data, 'totalResultsCount')) {
            // Fallback: check if data object has the count
            $document->setJsonapi(['totalResultsCount' => $data->totalResultsCount]);
        }
    }
}
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

/**
 * Thread-safe container for passing total results count between Filter/Search and LoadPagination.
 * Uses static property since Flarum handles requests sequentially.
 */
class TotalResultsCount
{
    private static ?int $count = null;

    public static function set(int $count): void
    {
        self::$count = $count;
    }

    public static function get(): ?int
    {
        return self::$count;
    }

    public static function reset(): void
    {
        self::$count = null;
    }
}

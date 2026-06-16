/**
 * ============================================================================
 * PC Puma Directory - Application JavaScript
 * ============================================================================
 * Manejo de DataTables, modales y operaciones CRUD via AJAX
 */

// Variables globales
let tableResponsables, tableProveedores, tableAutoridades, tableLogs, tableUsuarios;
let currentEditId = null;
let currentEditType = null;

// ============================================================================
// INICIALIZACIÓN
// ============================================================================

$(document).ready(function () {
    // Inicializar DataTables
    initDataTables();

    // Cargar datos iniciales
    loadData('responsables');
    loadData('autoridades_encrypted');
    loadData('proveedores');

    // Cargar logs y usuarios si es admin
    if (isAdmin) {
        loadLogs();
        loadUsers();
    }

    // Event listener para cambio de tabs
    $('button[data-bs-toggle="tab"]').on('shown.bs.tab', function (e) {
        // Ajustar columnas de DataTables al cambiar de tab
        $.fn.dataTable.tables({ visible: true, api: true }).columns.adjust();
    });
});

// ============================================================================
// INICIALIZACIÓN DE DATATABLES
// ============================================================================

function initDataTables() {
    // Configuración común
    const commonConfig = {
        language: {
            url: 'https://cdn.datatables.net/plug-ins/1.13.7/i18n/es-ES.json'
        },
        dom: 'Bfrtip',
        buttons: [
            {
                extend: 'csv',
                text: '<i class="bi bi-filetype-csv me-1"></i>CSV',
                className: 'btn btn-sm'
            },
            {
                extend: 'excel',
                text: '<i class="bi bi-file-earmark-excel me-1"></i>Excel',
                className: 'btn btn-sm'
            }
        ],
        pageLength: 10,
        responsive: true,
        processing: true
    };

    // Tabla Responsables
    tableResponsables = $('#table-responsables').DataTable({
        ...commonConfig,
        columns: [
            { data: 'num', defaultContent: '-' },
            { data: 'entidad', defaultContent: '-' },
            { data: 'nombre', defaultContent: '-' },
            { data: 'cargo', defaultContent: '-' },
            { data: 'telefono', defaultContent: '-' },
            { data: 'extension', defaultContent: '-' },
            {
                data: 'correo',
                defaultContent: '-',
                render: function (data) {
                    if (!data) return '-';
                    return `<a href="mailto:${data}" class="text-info">${data}</a>`;
                }
            },
            {
                data: null,
                orderable: false,
                render: function (data, type, row) {
                    return renderActions('responsables', row.id);
                }
            }
        ]
    });

    // Tabla Autoridades
    tableAutoridades = $('#table-autoridades').DataTable({
        ...commonConfig,
        columns: [
            {
                data: 'tipo_autoridad',
                defaultContent: '-',
                render: function (data) {
                    if (data === 'Director') {
                        return '<span class="badge bg-primary">Director</span>';
                    } else if (data === 'Secretario' || data === 'Secretario Administrativo') {
                        return '<span class="badge bg-secondary">Secretario</span>';
                    }
                    return `<span class="badge bg-info">${data}</span>`;
                }
            },
            { data: 'num', defaultContent: '-' },
            { data: 'entidad', defaultContent: '-' },
            { data: 'nombre', defaultContent: '-' },
            { data: 'cargo', defaultContent: '-' },
            { data: 'telefono', defaultContent: '-' },
            { data: 'extension', defaultContent: '-' },
            {
                data: 'correo',
                defaultContent: '-',
                render: function (data) {
                    if (!data) return '-';
                    return `<a href="mailto:${data}" class="text-info">${data}</a>`;
                }
            },
            {
                data: null,
                orderable: false,
                render: function (data, type, row) {
                    return renderActions('autoridades_encrypted', row.id);
                }
            }
        ]
    });

    // Filtros Rápidos de Autoridades
    $('input[name="btnfilter-aut"]').on('change', function () {
        const val = $(this).val();
        if (tableAutoridades) {
            tableAutoridades.column(0).search(val).draw();
        }
    });

    // Tabla Proveedores
    tableProveedores = $('#table-proveedores').DataTable({
        ...commonConfig,
        columns: [
            { data: 'empresa', defaultContent: '-' },
            { data: 'rubro', defaultContent: '-' },
            { data: 'telefono', defaultContent: '-' },
            {
                data: 'correo',
                defaultContent: '-',
                render: function (data) {
                    if (!data) return '-';
                    return `<a href="mailto:${data}" class="text-info">${data}</a>`;
                }
            },
            { data: 'rfc', defaultContent: '-' },
            {
                data: null,
                orderable: false,
                render: function (data, type, row) {
                    return renderActions('proveedores', row.id);
                }
            }
        ]
    });

    // Tabla Logs (solo para admin)
    if (isAdmin && $('#table-logs').length) {
        tableLogs = $('#table-logs').DataTable({
            ...commonConfig,
            buttons: [],
            order: [[0, 'desc']],
            columns: [
                { data: 'timestamp' },
                { data: 'user' },
                {
                    data: 'action',
                    render: function (data) {
                        const badges = {
                            'CREATE': 'bg-success',
                            'UPDATE': 'bg-warning text-dark',
                            'DELETE': 'bg-danger',
                            'BULK_IMPORT': 'bg-info'
                        };
                        return `<span class="badge ${badges[data] || 'bg-secondary'}">${data}</span>`;
                    }
                },
                { data: 'entity_type' },
                { data: 'entity_id', defaultContent: '-' },
                { data: 'ip' }
            ]
        });
    }

    // Tabla Usuarios (solo para admin)
    if (isAdmin && $('#table-usuarios').length) {
        tableUsuarios = $('#table-usuarios').DataTable({
            ...commonConfig,
            buttons: [],
            columns: [
                { data: 'name', defaultContent: '-' },
                {
                    data: 'email',
                    render: function (data) {
                        return `<a href="mailto:${data}">${data}</a>`;
                    }
                },
                {
                    data: 'role',
                    render: function (data) {
                        return data === 'admin'
                            ? '<span class="badge bg-danger">Admin</span>'
                            : '<span class="badge bg-info">Editor</span>';
                    }
                },
                {
                    data: 'source',
                    defaultContent: 'webapp',
                    render: function (data) {
                        return data === 'config'
                            ? '<span class="badge bg-secondary">Config</span>'
                            : '<span class="badge bg-primary">WebApp</span>';
                    }
                },
                {
                    data: 'created_at',
                    defaultContent: '-',
                    render: function (data) {
                        if (!data) return '-';
                        return new Date(data).toLocaleDateString('es-MX');
                    }
                },
                {
                    data: null,
                    orderable: false,
                    render: function (data, type, row) {
                        // No permitir editar/eliminar usuarios del config.php
                        if (row.source === 'config') {
                            return '<span class="text-muted small">Definido en config</span>';
                        }
                        return renderActions('usuarios', row.id);
                    }
                }
            ]
        });
    }
}

// ============================================================================
// RENDERIZAR BOTONES DE ACCIONES
// ============================================================================

function renderActions(type, id) {
    let html = `
        <div class="btn-group btn-group-sm">
            <button class="btn btn-outline-primary btn-action" onclick="editRecord('${type}', '${id}')" title="Editar">
                <i class="bi bi-pencil"></i>
            </button>
    `;

    // Solo mostrar botón eliminar si es admin
    if (isAdmin) {
        html += `
            <button class="btn btn-outline-danger btn-action" onclick="deleteRecord('${type}', '${id}')" title="Eliminar">
                <i class="bi bi-trash"></i>
            </button>
        `;
    }

    html += '</div>';
    return html;
}

// ============================================================================
// CARGAR DATOS
// ============================================================================

function loadData(type) {
    $.ajax({
        url: 'actions.php',
        method: 'GET',
        data: { action: 'list', type: type },
        success: function (response) {
            if (response.success) {
                let table;
                if (type === 'responsables') table = tableResponsables;
                else if (type === 'autoridades_encrypted') table = tableAutoridades;
                else if (type === 'proveedores') table = tableProveedores;
                else if (type === 'usuarios') table = tableUsuarios;

                if (table) {
                    table.clear().rows.add(response.data).draw();
                }

                // Actualizar contadores
                const statId = type === 'autoridades_encrypted' ? 'autoridades' : type;
                $(`#stat-${statId}`).text(response.data.length);
            }
        },
        error: function (xhr) {
            showToast('Error al cargar datos', 'error');
        }
    });
}

function loadUsers() {
    $.ajax({
        url: 'actions.php',
        method: 'GET',
        data: { action: 'users' },
        success: function (response) {
            if (response.success && tableUsuarios) {
                tableUsuarios.clear().rows.add(response.data).draw();
            }
        }
    });
}

function loadLogs() {
    $.ajax({
        url: 'actions.php',
        method: 'GET',
        data: { action: 'logs' },
        success: function (response) {
            if (response.success && tableLogs) {
                tableLogs.clear().rows.add(response.data).draw();
            }
        }
    });
}

// ============================================================================
// MODALES
// ============================================================================

function openModal(type, mode, data = null) {
    currentEditType = type;
    currentEditId = data?.id || null;

    let modalId, formId;

    if (type === 'responsables') {
        modalId = 'modalResponsable';
        formId = 'formResponsable';
    } else if (type === 'autoridades_encrypted') {
        modalId = 'modalAutoridad';
        formId = 'formAutoridad';
    } else if (type === 'proveedores') {
        modalId = 'modalProveedor';
        formId = 'formProveedor';
    } else if (type === 'usuarios') {
        modalId = 'modalUsuario';
        formId = 'formUsuario';
    }

    const modal = new bootstrap.Modal(document.getElementById(modalId));

    // Actualizar título
    let titleText;
    if (type === 'responsables') {
        titleText = mode === 'create' ? 'Nuevo Responsable TI' : 'Editar Responsable TI';
    } else if (type === 'autoridades_encrypted') {
        titleText = mode === 'create' ? 'Nueva Autoridad' : 'Editar Autoridad';
    } else if (type === 'proveedores') {
        titleText = mode === 'create' ? 'Nuevo Proveedor' : 'Editar Proveedor';
    } else if (type === 'usuarios') {
        titleText = mode === 'create' ? 'Nuevo Usuario' : 'Editar Usuario';
    }

    $(`#${modalId}Title`).html(`<i class="bi bi-${mode === 'create' ? 'plus-lg' : 'pencil'} me-2"></i>${titleText}`);

    // Limpiar o llenar formulario
    const form = document.getElementById(formId);
    form.reset();

    if (data) {
        if (type === 'responsables') {
            $('#resp-id').val(data.id);
            $('#resp-num').val(data.num || '');
            $('#resp-entidad').val(data.entidad || '');
            $('#resp-nombre').val(data.nombre || '');
            $('#resp-cargo').val(data.cargo || '');
            $('#resp-telefono').val(data.telefono || '');
            $('#resp-extension').val(data.extension || '');
            $('#resp-correo').val(data.correo || '');
        } else if (type === 'autoridades_encrypted') {
            $('#aut-id').val(data.id);
            $('#aut-tipo_autoridad').val(data.tipo_autoridad || '');
            $('#aut-num').val(data.num || '');
            $('#aut-entidad').val(data.entidad || '');
            $('#aut-nombre').val(data.nombre || '');
            $('#aut-cargo').val(data.cargo || '');
            $('#aut-telefono').val(data.telefono || '');
            $('#aut-extension').val(data.extension || '');
            $('#aut-correo').val(data.correo || '');
        } else if (type === 'proveedores') {
            $('#prov-id').val(data.id);
            $('#prov-empresa').val(data.empresa || '');
            $('#prov-rubro').val(data.rubro || '');
            $('#prov-telefono').val(data.telefono || '');
            $('#prov-correo').val(data.correo || '');
            $('#prov-rfc').val(data.rfc || '');
        } else if (type === 'usuarios') {
            $('#user-id').val(data.id);
            $('#user-email').val(data.email || '');
            $('#user-name').val(data.name || '');
            $('#user-role').val(data.role || 'editor');
        }
    }

    modal.show();
}

function openImportModal(type) {
    $('#import-type-select').val(type);
    updateImportFormatInfo(type);

    $('#csv-file').val('');

    const modal = new bootstrap.Modal(document.getElementById('modalImport'));
    modal.show();
}

function updateImportFormatInfo(type) {
    // Mostrar formato esperado
    let formatInfo = '';
    if (type === 'responsables') {
        formatInfo = 'Columnas: <code>num, entidad, nombre, cargo, telefono, extension, correo</code>';
    } else if (type === 'autoridades_encrypted') {
        formatInfo = 'Columnas: <code>tipo_autoridad, num, entidad, nombre, cargo, telefono, extension, correo</code>';
    } else {
        formatInfo = 'Columnas: <code>empresa, rubro, telefono, correo, rfc</code>';
    }
    $('#import-format-info').html(formatInfo);
}

// ============================================================================
// OPERACIONES CRUD
// ============================================================================

function saveRecord(event, type) {
    event.preventDefault();

    let formId;
    if (type === 'responsables') formId = 'formResponsable';
    else if (type === 'autoridades_encrypted') formId = 'formAutoridad';
    else if (type === 'proveedores') formId = 'formProveedor';
    else if (type === 'usuarios') formId = 'formUsuario';

    const form = document.getElementById(formId);
    const formData = new FormData(form);

    const id = formData.get('id');
    formData.append('action', id ? 'update' : 'create');
    formData.append('type', type);

    // Mostrar loading
    const submitBtn = $(form).find('button[type="submit"]');
    const originalText = submitBtn.html();
    submitBtn.html('<span class="spinner-border spinner-border-sm me-1"></span>Guardando...').prop('disabled', true);

    $.ajax({
        url: 'actions.php',
        method: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
            if (response.success) {
                showToast(response.message, 'success');

                // Cerrar modal
                let modalId;
                if (type === 'responsables') modalId = 'modalResponsable';
                else if (type === 'autoridades_encrypted') modalId = 'modalAutoridad';
                else if (type === 'proveedores') modalId = 'modalProveedor';
                else if (type === 'usuarios') modalId = 'modalUsuario';

                bootstrap.Modal.getInstance(document.getElementById(modalId)).hide();

                // Recargar datos
                if (type === 'usuarios') {
                    loadUsers();
                } else {
                    loadData(type);
                }
                updateStats();
            } else {
                showToast(response.error || 'Error al guardar', 'error');
            }
        },
        error: function (xhr) {
            const msg = xhr.responseJSON?.error || 'Error de conexión';
            showToast(msg, 'error');
        },
        complete: function () {
            submitBtn.html(originalText).prop('disabled', false);
        }
    });

    return false;
}

function editRecord(type, id) {
    // Buscar registro en la tabla
    let table;
    if (type === 'responsables') table = tableResponsables;
    else if (type === 'autoridades_encrypted') table = tableAutoridades;
    else if (type === 'proveedores') table = tableProveedores;
    else if (type === 'usuarios') table = tableUsuarios;

    const data = table.rows().data().toArray().find(row => row.id === id);

    if (data) {
        openModal(type, 'edit', data);
    }
}

function deleteRecord(type, id) {
    const confirmMsg = type === 'usuarios'
        ? '¿Estás seguro de que deseas eliminar este usuario?\n\nYa no podrá acceder al sistema.'
        : '¿Estás seguro de que deseas eliminar este registro?\n\nEsta acción no se puede deshacer.';

    if (!confirm(confirmMsg)) {
        return;
    }

    $.ajax({
        url: 'actions.php',
        method: 'POST',
        data: {
            action: 'delete',
            type: type,
            id: id
        },
        success: function (response) {
            if (response.success) {
                showToast(response.message, 'success');

                if (type === 'usuarios') {
                    loadUsers();
                } else {
                    loadData(type);
                }
                updateStats();
                if (isAdmin) loadLogs();
            } else {
                showToast(response.error || 'Error al eliminar', 'error');
            }
        },
        error: function (xhr) {
            const msg = xhr.responseJSON?.error || 'Error de conexión';
            showToast(msg, 'error');
        }
    });
}

// ============================================================================
// IMPORTAR CSV
// ============================================================================

function importCSV(event) {
    event.preventDefault();

    const form = document.getElementById('formImport');
    const formData = new FormData(form);
    formData.append('action', 'import');

    const type = formData.get('import_type');
    formData.append('type', type);

    // Validar archivo
    const fileInput = document.getElementById('csv-file');
    if (!fileInput.files.length) {
        showToast('Selecciona un archivo CSV', 'error');
        return false;
    }

    // Mostrar loading
    const submitBtn = $(form).find('button[type="submit"]');
    const originalText = submitBtn.html();
    submitBtn.html('<span class="spinner-border spinner-border-sm me-1"></span>Importando...').prop('disabled', true);

    $.ajax({
        url: 'actions.php',
        method: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
            if (response.success) {
                showToast(response.message, 'success');
                bootstrap.Modal.getInstance(document.getElementById('modalImport')).hide();
                loadData(type);
                updateStats();
                if (isAdmin) loadLogs();
            } else {
                showToast(response.error || 'Error al importar', 'error');
            }
        },
        error: function (xhr) {
            const msg = xhr.responseJSON?.error || 'Error de conexión';
            showToast(msg, 'error');
        },
        complete: function () {
            submitBtn.html(originalText).prop('disabled', false);
        }
    });

    return false;
}

// ============================================================================
// UTILIDADES
// ============================================================================

function updateStats() {
    $.ajax({
        url: 'actions.php',
        method: 'GET',
        data: { action: 'stats' },
        success: function (response) {
            if (response.success) {
                $('#stat-responsables').text(response.data.total_responsables);
                $('#stat-autoridades').text(response.data.total_autoridades || 0);
                $('#stat-proveedores').text(response.data.total_proveedores);

                if (response.data.last_update) {
                    const date = new Date(response.data.last_update);
                    $('#stat-update').text(date.toLocaleString('es-MX'));
                }
            }
        }
    });
}

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');

    // Limpiar clases anteriores
    toast.classList.remove('bg-success', 'bg-danger', 'bg-warning', 'bg-info', 'text-white');

    // Aplicar nueva clase según tipo
    switch (type) {
        case 'success':
            toast.classList.add('bg-success', 'text-white');
            break;
        case 'error':
            toast.classList.add('bg-danger', 'text-white');
            break;
        case 'warning':
            toast.classList.add('bg-warning');
            break;
        default:
            toast.classList.add('bg-info', 'text-white');
    }

    toastMessage.textContent = message;

    const bsToast = new bootstrap.Toast(toast, { delay: 4000 });
    bsToast.show();
}

function confirmLogout() {
    return confirm('¿Estás seguro de que deseas cerrar sesión?');
}
